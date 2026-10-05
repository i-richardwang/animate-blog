'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { MotionEffect } from '@/components/effects/motion-effect';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

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

function FeaturedCard({ reading }: { reading: Reading }) {
  return (
    <MotionEffect
      slide={{ direction: 'down', offset: 30 }}
      fade
      inView
      delay={0.2}
    >
      <Link href={reading.url}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="group bg-card rounded-md overflow-hidden cursor-pointer"
        >
          <div className="flex flex-col md:flex-row">
            {reading.image && (
              <div className="relative w-full md:w-1/2 aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={reading.image}
                  alt={reading.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-6 px-2 bg-primary text-primary-foreground text-xs rounded flex gap-1 items-center justify-center">
                  <Sparkles className="size-3" />
                  本周推荐
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-medium group-hover:text-primary transition-colors line-clamp-2 mb-3">
                {reading.title}
              </h2>

              {reading.description && (
                <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-4">
                  {reading.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {reading.author && (
                  <>
                    <span>{reading.author.name}</span>
                    <span className="text-muted-foreground/50">·</span>
                  </>
                )}
                <time dateTime={reading.date.toISOString()}>
                  {format(reading.date, 'MMM d, yyyy', { locale: enUS })}
                </time>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </MotionEffect>
  );
}

function ReadingCard({ reading, index }: { reading: Reading; index: number }) {
  return (
    <MotionEffect
      slide={{ direction: 'down', offset: 30 }}
      fade
      inView
      delay={0.3 + index * 0.08}
    >
      <Link href={reading.url}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-full group bg-card rounded-md overflow-hidden cursor-pointer"
        >
          {reading.image && (
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
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
              {reading.author && <span>{reading.author.name}</span>}
              <time dateTime={reading.date.toISOString()}>
                {format(reading.date, 'MMM d, yyyy', { locale: enUS })}
              </time>
            </div>
          </div>
        </motion.div>
      </Link>
    </MotionEffect>
  );
}

export function ReadingList({ readings }: ReadingListProps) {
  if (readings.length === 0) return null;

  const [featured, ...rest] = readings;

  return (
    <div className="space-y-8 not-prose">
      {featured && <FeaturedCard reading={featured} />}

      {rest.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-muted-foreground">往期推荐</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((reading, index) => (
              <ReadingCard key={reading.url} reading={reading} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
