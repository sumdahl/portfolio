'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GitHubContributionWeek, GitHubRawContributionDay } from '@/types/github';
import { Card } from '@/components/ui/card';

interface ContributionHeatmapProps {
  weeks: GitHubContributionWeek[];
  totalContributions?: number;
  year: number;
}

const LEVELS = {
  0: 'bg-muted/50', // Subtle for empty days
  1: 'bg-primary/30',
  2: 'bg-primary/50',
  3: 'bg-primary/70',
  4: 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]', // Glow effect for high contribution
};

export function ContributionHeatmap({ weeks, totalContributions, year }: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ day: GitHubRawContributionDay; x: number; y: number } | null>(null);

  // Calculate statistics
  const days = weeks.flatMap(week => week.contributionDays);
  const activeDays = days.filter(day => day.contributionCount > 0).length;
  const maxContributions = Math.max(...days.map(day => day.contributionCount), 0);

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // For longest streak
  days.forEach(day => {
    if (day.contributionCount > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  // For current streak (checking backwards from the end)
  // We assume the last day in the array is "today" or the latest fetched date
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      currentStreak++;
    } else {
      // Allow for the case where today has 0 contributions but yesterday had some (streak not broken yet if strictly following GitHub logic usually, but strict streak means 0 today breaks it. Let's be strict: if last day is 0, streak is 0, UNLESS the data represents "up to today" and user hasn't committed *yet* today. 
      // For simplicity in this visualization, if the very last day is 0, we check the day before. If that's 0, streak is broken.
      // Actually, standard logic: count backwards until a 0 is found.
      break;
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getLevel = (levelStr: string): 0 | 1 | 2 | 3 | 4 => {
    // Handle specific GitHub GraphQL Enums
    switch (levelStr) {
      case 'NONE': return 0;
      case 'FIRST_QUARTILE': return 1;
      case 'SECOND_QUARTILE': return 2;
      case 'THIRD_QUARTILE': return 3;
      case 'FOURTH_QUARTILE': return 4;
    }

    // Handle number strings (legacy or mock data)
    const num = parseInt(levelStr, 10);
    if (isNaN(num)) return 0;
    return Math.min(Math.max(num, 0), 4) as 0 | 1 | 2 | 3 | 4;
  };

  const handleMouseEnter = (day: GitHubRawContributionDay, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay({
      day,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  const stats = [
    { label: 'Total Active Days', value: activeDays },
    { label: 'Max Contributions', value: maxContributions },
    { label: 'Current Streak', value: `${currentStreak} days` },
    { label: 'Longest Streak', value: `${longestStreak} days` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-background/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-border/50 max-w-3xl mx-auto w-full overflow-hidden shadow-lg mx-4"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          GitHub Contributions
        </h3>
        {totalContributions !== undefined && (
          <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium border border-primary/20">
            {totalContributions} contributions in year {year}
          </span>
        )}
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent mb-6">
        <div className="min-w-max">
          <div className="flex gap-1 p-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.contributionDays.map((day, dayIndex) => {
                  const level = getLevel(day.contributionLevel);
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-300 hover:scale-125 hover:z-10 relative ${LEVELS[level]}`}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={() => setHoveredDay(null)}
                      role="img"
                      aria-label={`${day.contributionCount} contributions on ${day.date}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-3 rounded-xl bg-background/50 border border-border/50">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              {stat.value}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide mt-1 text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Tooltip Portal or Fixed Position Overlay */}
      {hoveredDay && (
        <div
          className="fixed z-50 px-3 py-2 text-xs font-medium text-popover-foreground bg-popover border border-border/50 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full pb-1 backdrop-blur-md bg-popover/90"
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y - 12
          }}
        >
          <div className="whitespace-nowrap flex flex-col items-center gap-0.5">
            <span className="font-bold">{hoveredDay.day.contributionCount} contributions</span>
            <span className="text-muted-foreground text-[10px]">{formatDate(hoveredDay.day.date)}</span>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-popover border-r border-b border-border/50 transform rotate-45"></div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground justify-end opacity-70">
        <span>Less</span>
        <div className="flex gap-1">
          {Object.entries(LEVELS).map(([key, className]) => (
            <div key={key} className={`w-3 h-3 rounded-sm ${className.split(' ')[0]}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}
