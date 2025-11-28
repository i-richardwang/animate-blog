'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { MotionEffect } from '@/components/effects/motion-effect';
import { motion } from 'motion/react';

interface Reading {
  url: string;
  title: string;
  description?: string;
  date: Date;
  author?: {
    name: string;
    url?: string;
  };
  image?: string;
}

interface ReadingListProps {
  readings: Reading[];
}

export function ReadingList({ readings }: ReadingListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose">
      {readings.map((reading, index) => (
        <MotionEffect
          key={reading.url}
          slide={{ direction: 'down', offset: 30 }}
          fade
          inView
          delay={0.2 + index * 0.08}
        >
          <Link href={reading.url}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full group dark:bg-neutral-800 bg-neutral-100 rounded-2xl overflow-hidden cursor-pointer"
            >
              {reading.image && (
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                  <img
                    src={reading.image}
                    alt={reading.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-lg md:text-xl font-medium group-hover:text-primary transition-colors line-clamp-2 mb-3">
                  {reading.title}
                </h2>

                {reading.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {reading.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {reading.author && (
                    <span>
                      {reading.author.name}
                    </span>
                  )}
                  <time dateTime={reading.date.toISOString()}>
                    {format(reading.date, 'MMM d, yyyy', { locale: enUS })}
                  </time>
                </div>
              </div>
            </motion.div>
          </Link>
        </MotionEffect>
      ))}
    </div>
  );
}
