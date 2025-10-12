'use client';

import Link from 'next/link';
import { MotionEffect } from '@/components/effects/motion-effect';
import { motion } from 'motion/react';

interface Project {
  url: string;
  title: string;
  description?: string;
  date: Date;
  tech?: string[];
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
  image?: string;
  logo?: string;
  featured?: boolean;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
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
              className="h-full group dark:bg-neutral-800 bg-neutral-100 rounded-2xl overflow-hidden cursor-pointer"
            >
              {project.image && (
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  {project.logo && (
                    <div className="flex-shrink-0 size-10 rounded-lg overflow-hidden bg-background border border-border/50 flex items-center justify-center">
                      <img
                        src={project.logo}
                        alt={`${project.title} logo`}
                        className="size-full object-contain p-1.5"
                      />
                    </div>
                  )}
                  <h2 className="flex-1 text-lg md:text-xl font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h2>
                </div>

                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>
                )}

                {project.tech && project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-md bg-background/50 text-foreground/80 border border-border/50"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="text-xs px-2 py-1 text-muted-foreground">
                        +{project.tech.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </Link>
        </MotionEffect>
      ))}
    </div>
  );
}
