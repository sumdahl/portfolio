import type { Project } from '@/types/project';

// Sample projects - replace with your actual projects
export const projects: Project[] = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'Modern TypeScript-first portfolio with Next.js, custom MDX blog, and GitHub integration',
    longDescription: 'A fully-featured portfolio website built with Next.js 16, TypeScript, and Tailwind CSS. Features include a custom MDX blog system with live preview, GitHub contribution heatmap, and dark-mode-first design.',
    techStack: ['TypeScript', 'Next.js', 'Tailwind CSS', 'MDX', 'Bun'],
    githubUrl: 'https://github.com/sumdahl/portfolio',
    liveUrl: 'https://sumirandahal.com',
    featured: true,
    challenges: [
      'Implementing a custom MDX blog editor with live preview',
      'Integrating GitHub GraphQL API with proper caching',
      'Creating an accessible contribution heatmap',
    ],
    learnings: [
      'Advanced Next.js App Router patterns',
      'TypeScript best practices for large projects',
      'Performance optimization techniques',
    ],
    date: '2026-01-30',
  },
  // Add more projects here
];
