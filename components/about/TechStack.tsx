'use client';

import { motion } from 'framer-motion';
import {
    SiDotnet,
    SiPostgresql,
    SiDocker,
    SiNodedotjs,
    SiPython,
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiTailwindcss,
    SiGraphql,
    SiSupabase,
    SiJavascript,
    SiHtml5,
    SiCss3,
    SiGit,
    SiFastapi,
    SiPostman,
    SiN8N,
    SiRedis,
    SiMongodb,
} from 'react-icons/si';
import { FaJava, FaServer } from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Backend-focused ordering
const techs = [
    // Backend Core
    { name: '.NET Core', icon: SiDotnet, color: '#512BD4', category: 'Backend' },
    { name: 'Java', icon: FaJava, color: '#007396', category: 'Backend' },
    { name: 'Python', icon: SiPython, color: '#3776AB', category: 'Backend' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', category: 'Backend' },
    { name: 'FastAPI', icon: SiFastapi, color: '#009688', category: 'Backend' },

    // Database & Infrastructure
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', category: 'Database' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED', category: 'DevOps' },
    { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E', category: 'Database' },
    { name: 'GraphQL', icon: SiGraphql, color: '#E10098', category: 'API' },
    { name: 'Git', icon: SiGit, color: '#F05032', category: 'Tools' },

    // Tools & Automation
    { name: 'Postman', icon: SiPostman, color: '#FF6C37', category: 'Tools' },
    { name: 'n8n', icon: SiN8N, color: '#FF6E5C', category: 'Automation' },

    // Languages & Frontend (Secondary)
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', category: 'Language' },
    { name: 'React', icon: SiReact, color: '#61DAFB', category: 'Frontend' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff', category: 'Frontend' },
    { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4', category: 'Frontend' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', category: 'Language' },
];

export function TechStack() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-md">
                    <FaServer className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-mono tracking-tight">
                    Technical_Arsenal
                    <span className="text-primary animate-pulse">_</span>
                </h2>
                <div className="h-px bg-border/50 flex-1 ml-4" />
                <span className="text-xs font-mono text-muted-foreground hidden sm:block">v2.0.26</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {techs.map((tech, index) => (
                    <TechCard key={tech.name} tech={tech} index={index} />
                ))}
            </div>
        </section>
    );
}

function TechCard({ tech, index }: { tech: typeof techs[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="group relative"
        >
            <Card className="relative h-20 flex flex-col items-center justify-center gap-1.5 bg-background/30 backdrop-blur-sm border-white/5 overflow-hidden transition-all duration-300 hover:ring-1 hover:ring-primary/50 group-hover:bg-background/50">

                {/* Tech Color Glow Lines */}
                <div
                    className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: tech.color }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[2px] h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: tech.color }}
                />

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-30 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center gap-1.5">
                    <tech.icon
                        className="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        style={{ color: tech.color }}
                    />
                    <span className="text-[10px] font-mono font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                        {tech.name}
                    </span>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-muted-foreground/20 rounded-full" />
            </Card>
        </motion.div>
    );
}
