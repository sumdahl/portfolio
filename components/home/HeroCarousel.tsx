'use client';

import { motion } from 'framer-motion';
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiTailwindcss,
    SiNodedotjs,
    SiPostgresql,
    SiDocker,
    SiGraphql,
    SiSupabase,
    SiJavascript,
    SiHtml5,
    SiCss3,
    SiGit
} from 'react-icons/si';

const techs = [
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED' },
    { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
    { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
    { name: 'Git', icon: SiGit, color: '#F05032' },
];

export function HeroCarousel() {
    return (
        <div className="w-full overflow-hidden py-10 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
            <motion.div
                className="flex gap-16 w-max"
                animate={{ x: [0, -1920] }} // Adjust based on content width
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 30, // Slow, smooth scroll
                }}
            >
                {/* Double the list to create seamless loop */}
                {[...techs, ...techs].map((tech, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 group cursor-default">
                        <tech.icon
                            className="w-12 h-12 md:w-16 md:h-16 transition-all duration-300 transform group-hover:scale-110"
                            style={{ color: tech.color }} // Use brand color on individual icons for a nice effect even in grayscale mode (which filters it out until hover)
                        />
                        <span className="text-sm font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
