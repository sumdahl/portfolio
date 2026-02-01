'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Code2, Terminal, Layout } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Project } from '@/types/project';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  // Determine fallback icon based on project type
  const getFallbackIcon = () => {
    if (project.type?.includes('Frontend')) return <Layout className="w-12 h-12 text-primary/30" />;
    if (project.type?.includes('API') || project.type?.includes('Backend')) return <Terminal className="w-12 h-12 text-primary/30" />;
    return <Code2 className="w-12 h-12 text-primary/30" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
      whileHover={{ y: -8 }}
    >
      <Card className="h-full flex flex-col bg-background/30 backdrop-blur-xl border-white/10 hover:border-primary/30 transition-colors duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 relative">

        {/* Hover Gradient Glow Border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Image / Icon Header */}
        <div className="relative border-b border-white/5 h-40 overflow-hidden bg-muted/20">
          {project.imageUrl ? (
            <div className="w-full h-full relative">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:filter group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors duration-500">
              {getFallbackIcon()}
            </div>
          )}

          {/* Top Right Actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-8px] group-hover:translate-y-0 z-10">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                className="p-1.5 bg-background/60 backdrop-blur-md border border-white/10 rounded-full hover:bg-primary hover:text-white transition-all shadow-lg"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Type Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 shadow-sm"
            >
              {project.type || 'Project'}
            </Badge>
          </div>
        </div>

        <CardHeader className="pt-4 pb-1 px-5 space-y-1 relative z-10">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {project.title}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-5 py-2 space-y-3 relative z-10">
          <p className="text-muted-foreground/90 text-sm leading-relaxed line-clamp-3 min-h-[3.75rem]">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1 pt-1">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="bg-primary/5 border-primary/10 text-primary/70 group-hover:bg-primary/10 group-hover:border-primary/20 text-[9px] py-0 px-2 transition-all"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-4 pt-3 border-t border-border/20 mt-auto flex items-center justify-between relative z-10">
          <Link
            href={project.githubUrl}
            target="_blank"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group/link px-2 py-1.5 rounded-md hover:bg-muted/50 -ml-2"
          >
            <Github className="w-3.5 h-3.5 mr-1.5 group-hover/link:text-primary transition-colors" />
            Code
          </Link>

          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              className="inline-flex items-center text-xs font-semibold text-primary/80 hover:text-primary transition-colors px-2 py-1.5 rounded-md hover:bg-primary/5 -mr-2"
            >
              Live Demo
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
