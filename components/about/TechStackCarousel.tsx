'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const techStack = [
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#000000' },
  { name: 'Node.js', color: '#339933' },
  { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Git', color: '#F05032' },
  { name: 'Tailwind CSS', color: '#06B6D4' },
];

export function TechStackCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 30);

    return () => clearInterval(intervalId);
  }, []);

  // Duplicate items for infinite scroll effect
  const duplicatedStack = [...techStack, ...techStack];

  return (
    <div className="w-full overflow-hidden py-8">
      <h3 className="text-2xl font-bold text-body mb-6 text-center">Tech Stack</h3>
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedStack.map((tech, index) => (
          <motion.div
            key={`${tech.name}-${index}`}
            className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[120px]"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: tech.color }}
            >
              <span className="text-white mix-blend-difference">
                {tech.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-accent font-medium">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
