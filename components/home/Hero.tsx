'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SocialLinks } from '@/components/shared/SocialLinks';
import { ProfilePhoto } from './ProfilePhoto';
import { HeroCarousel } from './HeroCarousel';
import { ContributionHeatmap } from '@/components/github/ContributionHeatmap';
import type { GitHubContributionCalendar } from '@/types/github';

interface HeroProps {
  contributionCalendar?: GitHubContributionCalendar | null;
}

export function Hero({ contributionCalendar }: HeroProps) {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden pt-12 pb-10 md:pt-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary opacity-50" />

      <div className="container mx-auto px-4 relative z-10 flex-grow flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-10"
          >
            <ProfilePhoto />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-2"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight tracking-tight">
              Sumiran Dahal
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="px-4"
          >
            <a
              href="https://citytech.global"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xl sm:text-2xl md:text-4xl font-semibold text-muted-foreground mb-6 md:mb-8 hover:text-primary transition-colors group"
            >
              Software Engineering Intern at Citytech
              <ArrowRight className="w-5 h-5 md:w-8 md:h-8 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full px-8 md:px-0"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 md:h-14 px-8 text-base md:text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/50 rounded-full h-12 md:h-14 px-8 text-base md:text-lg"
            >
              <Link href="/projects">View Projects</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mb-10 md:mb-16"
          >
            <SocialLinks />
          </motion.div>

          {/* GitHub Activity Component */}
          {contributionCalendar && (
            <div className="mb-6">
              <ContributionHeatmap
                weeks={contributionCalendar.weeks}
                totalContributions={contributionCalendar.totalContributions}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tech Stack Carousel at the very bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full mt-auto pb-8 border-t border-border/10 bg-background/20 backdrop-blur-sm"
      >
        <HeroCarousel />
      </motion.div>
    </section>
  );
}
