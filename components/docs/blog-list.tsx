'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { MotionEffect } from '@/components/effects/motion-effect';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Post {
  url: string;
  title: string;
  description?: string;
  date: Date;
  tags?: string[];
}

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="space-y-6 not-prose">
      {posts.map((post, index) => (
        <MotionEffect
          key={post.url}
          slide={{ direction: 'down', offset: 30 }}
          fade
          inView
          delay={0.2 + index * 0.08}
        >
          <Link href={post.url}>
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="group flex items-center justify-between gap-4 py-4 px-4 -mx-4 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <time
                  dateTime={post.date.toISOString()}
                  className="text-sm text-muted-foreground mb-2 block"
                >
                  {format(post.date, 'MMMM d, yyyy', { locale: enUS })}
                </time>
                <h2 className="text-lg md:text-xl font-medium mb-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {post.description}
                  </p>
                )}
              </div>
              <motion.div
                className="flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="size-4" />
              </motion.div>
            </motion.div>
          </Link>
        </MotionEffect>
      ))}
    </div>
  );
}
