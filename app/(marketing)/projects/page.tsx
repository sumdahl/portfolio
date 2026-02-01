import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects } from '@/content/projects';

export const metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of web development projects, showcasing expertise in TypeScript, React, Next.js, and modern web technologies.',
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 space-y-4 relative">
          <div className="mb-16 space-y-4 relative">
            {/* Ambient Background Glows */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[80px] -z-10" />

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">Projects</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Here are some of the projects I&apos;ve worked on. Each project showcases different
              aspects of my skills and expertise in web development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-accent text-lg">No projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
