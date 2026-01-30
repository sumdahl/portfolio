'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubData {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
}

export function GitHubActivity() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch GitHub contribution data
    fetch('/api/github/contributions')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch GitHub data:', err);
        setLoading(false);
      });
  }, []);

  const getLevelColor = (level: number) => {
    const colors = {
      0: 'bg-foreground/10', // Light empty slots relative to theme
      1: 'bg-primary/40',
      2: 'bg-primary/60',
      3: 'bg-primary/80',
      4: 'bg-primary',
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  return (
    <section className="py-20 bg-background" id="github-activity">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 bg-card border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <GitHubLogoIcon className="w-8 h-8 text-foreground" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    GitHub Contributions
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    My open source activity and coding journey
                  </p>
                </div>
              </div>
              <Link
                href="https://github.com/sumdahl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                View Profile →
              </Link>
            </div>

            {/* Stats */}
            {!loading && data && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-3xl font-bold text-primary">{data.totalContributions}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Contributions</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-3xl font-bold text-primary">365</p>
                  <p className="text-sm text-muted-foreground mt-1">Days Tracked</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-3xl font-bold text-primary">
                    {data.weeks.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Weeks Active</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <p className="text-3xl font-bold text-primary">
                    {Math.round(data.totalContributions / 52)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Avg/Week</p>
                </div>
              </div>
            )}

            {/* Contribution Heatmap */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : data ? (
                <div className="inline-flex flex-col gap-1 min-w-full">
                  <div className="flex gap-1">
                    {data.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.contributionDays.map((day, dayIndex) => (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
                            title={`${day.date}: ${day.count} contributions`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
                      />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Failed to load GitHub data
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
