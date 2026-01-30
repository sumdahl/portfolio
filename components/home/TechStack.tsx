'use client';

import { 
  SiTypescript, 
  SiGit, 
  SiNestjs, 
  SiNextdotjs, 
  SiFastapi, 
  SiDotnet,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiLinux,
  SiTailwindcss,
  SiReact,
  SiNodedotjs,
  SiPython
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { motion } from 'framer-motion';

const technologies = [
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
  { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
  { name: '.NET', icon: SiDotnet, color: '#512BD4' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Linux', icon: SiLinux, color: '#FCC624' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Java', icon: FaJava, color: '#007396' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
];

export function TechStack() {
  return (
    <section className="py-20 bg-background" id="tech-stack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tech Stack & Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies I work with to build modern, scalable applications
          </p>
        </motion.div>

        {/* Logo Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-border hover:border-accent/50 transition-all cursor-pointer group"
              >
                <Icon 
                  className="w-12 h-12 mb-3 transition-colors"
                  style={{ color: tech.color }}
                />
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                  {tech.name}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-accent font-medium">
            Full Stack Software Engineer
          </p>
          <p className="text-muted-foreground mt-2">
            Expertise in REST APIs, Microservices, Cloud Infrastructure & DevOps
          </p>
        </motion.div>
      </div>
    </section>
  );
}
