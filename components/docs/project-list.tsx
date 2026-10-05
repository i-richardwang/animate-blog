'use client';

import Link from 'next/link';
import { MotionEffect } from '@/components/motion-effect';
import { motion } from 'motion/react';
import { TechStackIcons } from '@/components/tech-stack-icons';

interface Project {
  url: string;
  title: string;
  description?: string;
  tech: string[];
  logo: string;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose">
      {projects.map((project, index) => (
        <MotionEffect
          key={project.url}
          slide={{ direction: 'down', offset: 30 }}
          fade
          inView
          delay={0.2 + index * 0.08}
        >
          <Link href={project.url}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full group bg-card rounded-md overflow-hidden cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 size-6 flex items-center justify-center">
                    <img
                      src={project.logo}
                      alt={`${project.title} logo`}
                      className="size-full object-contain"
                    />
                  </div>
                  <h2 className="flex-1 text-lg md:text-xl font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h2>
                </div>

                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>
                )}

                {project.tech.length > 0 && (
                  <TechStackIcons tech={project.tech} maxDisplay={7} />
                )}
              </div>
            </motion.div>
          </Link>
        </MotionEffect>
      ))}
    </div>
  );
}
