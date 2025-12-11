'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { MotionEffect } from '@/components/effects/motion-effect';
import { motion } from 'motion/react';
import { Headphones, Clock, Mic } from 'lucide-react';

interface Podcast {
  url: string;
  title: string;
  description?: string;
  date: Date;
  podcastName: string;
  episodeTitle: string;
  hosts: string[];
  guests: string[];
  duration?: string;
  image?: string;
}

interface PodcastListProps {
  podcasts: Podcast[];
}

function FeaturedCard({ podcast }: { podcast: Podcast }) {
  return (
    <MotionEffect
      slide={{ direction: 'down', offset: 30 }}
      fade
      inView
      delay={0.2}
    >
      <Link href={podcast.url}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="group bg-card rounded-md overflow-hidden cursor-pointer"
        >
          <div className="flex flex-col md:flex-row">
            {podcast.image && (
              <div className="relative w-full md:w-[280px] md:h-[280px] aspect-square md:aspect-auto flex-shrink-0 overflow-hidden bg-muted">
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-6 px-2 bg-primary text-primary-foreground text-xs rounded flex gap-1 items-center justify-center">
                  <Headphones className="size-3" />
                  本周推荐
                </span>
                {podcast.duration && (
                  <span className="h-6 px-2 bg-muted text-muted-foreground text-xs rounded flex gap-1 items-center justify-center">
                    <Clock className="size-3" />
                    {podcast.duration}
                  </span>
                )}
              </div>

              <div className="text-sm text-muted-foreground mb-2">
                {podcast.podcastName}
              </div>

              <h2 className="text-xl md:text-2xl font-medium group-hover:text-primary transition-colors line-clamp-2 mb-3">
                {podcast.title}
              </h2>

              {podcast.description && (
                <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-4">
                  {podcast.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {podcast.hosts.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Mic className="size-3" />
                    <span>{podcast.hosts.join(', ')}</span>
                  </div>
                )}
                {podcast.guests.length > 0 && (
                  <>
                    <span className="text-muted-foreground/50">|</span>
                    <span>嘉宾: {podcast.guests.join(', ')}</span>
                  </>
                )}
                <span className="text-muted-foreground/50">·</span>
                <time dateTime={podcast.date.toISOString()}>
                  {format(podcast.date, 'MMM d, yyyy', { locale: enUS })}
                </time>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </MotionEffect>
  );
}

function PodcastCard({ podcast, index }: { podcast: Podcast; index: number }) {
  return (
    <MotionEffect
      slide={{ direction: 'down', offset: 30 }}
      fade
      inView
      delay={0.3 + index * 0.08}
    >
      <Link href={podcast.url}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-full group bg-card rounded-md overflow-hidden cursor-pointer"
        >
          {podcast.image && (
            <div className="relative w-full aspect-square overflow-hidden bg-muted">
              <img
                src={podcast.image}
                alt={podcast.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <span>{podcast.podcastName}</span>
              {podcast.duration && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {podcast.duration}
                  </span>
                </>
              )}
            </div>

            <h2 className="text-lg md:text-xl font-medium group-hover:text-primary transition-colors line-clamp-2 mb-3">
              {podcast.title}
            </h2>

            {podcast.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {podcast.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {podcast.hosts.length > 0 && (
                  <span>{podcast.hosts[0]}</span>
                )}
                {podcast.guests.length > 0 && (
                  <span className="text-muted-foreground/50">
                    {' '}x {podcast.guests[0]}
                  </span>
                )}
              </div>
              <time dateTime={podcast.date.toISOString()}>
                {format(podcast.date, 'MMM d, yyyy', { locale: enUS })}
              </time>
            </div>
          </div>
        </motion.div>
      </Link>
    </MotionEffect>
  );
}

export function PodcastList({ podcasts }: PodcastListProps) {
  if (podcasts.length === 0) return null;

  const [featured, ...rest] = podcasts;

  return (
    <div className="space-y-8 not-prose">
      {featured && <FeaturedCard podcast={featured} />}

      {rest.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-muted-foreground">往期推荐</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((podcast, index) => (
              <PodcastCard key={podcast.url} podcast={podcast} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
