'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col bg-secondary border-border hover:border-accent transition-colors">
        <CardHeader>
          <CardTitle className="text-2xl text-body">{project.title}</CardTitle>
          <CardDescription className="text-accent">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="space-y-4">
            {/* Tech Stack */}
            <div>
              <h4 className="text-sm font-semibold text-body mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="bg-primary text-accent">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Challenges (if available) */}
            {project.challenges && project.challenges.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-body mb-2">Challenges</h4>
                <ul className="text-sm text-accent space-y-1">
                  {project.challenges.slice(0, 2).map((challenge, idx) => (
                    <li key={idx}>• {challenge}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            asChild
            variant="default"
            className="bg-action hover:bg-action/90 text-white"
          >
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Link>
          </Button>
          {project.liveUrl && (
            <Button
              asChild
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-primary"
            >
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
