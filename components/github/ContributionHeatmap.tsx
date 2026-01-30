'use client';

import { useState } from 'react';
import type { GitHubContribution } from '@/types/github';

interface ContributionHeatmapProps {
  contributions: GitHubContribution[];
  totalContributions: number;
}

const LEVELS = {
  0: 'bg-secondary/30',
  1: 'bg-accent/40',
  2: 'bg-accent/60',
  3: 'bg-accent/80',
  4: 'bg-accent',
};

export function ContributionHeatmap({
  contributions,
  totalContributions,
}: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<GitHubContribution | null>(null);

  // Group contributions by week
  const weeks: GitHubContribution[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-body">GitHub Contributions</h3>
        <p className="text-accent">
          <span className="font-semibold text-body">{totalContributions}</span> contributions this year
        </p>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-accent ${
                      LEVELS[day.level]
                    }`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-secondary border border-border rounded-lg px-3 py-2 text-sm whitespace-nowrap z-10">
            <p className="text-body font-semibold">
              {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}
            </p>
            <p className="text-accent text-xs">
              {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-sm text-accent">
        <span>Less</span>
        <div className="flex gap-1">
          {Object.values(LEVELS).map((level, index) => (
            <div key={index} className={`w-3 h-3 rounded-sm ${level}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
