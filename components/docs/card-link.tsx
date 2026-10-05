'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { MotionEffect } from '@/components/motion-effect';
import { cn } from '@/lib/utils';

// A list entry that slides in when scrolled into view and moves on hover:
// cards lift, rows nudge right.
export function CardLink({
  href,
  delay,
  hover = 'lift',
  className,
  children,
}: {
  href: string;
  delay: number;
  hover?: 'lift' | 'nudge';
  className: string;
  children: React.ReactNode;
}) {
  return (
    <MotionEffect
      slide={{ direction: 'down', offset: 30 }}
      fade
      inView
      delay={delay}
    >
      <Link href={href}>
        <motion.div
          whileHover={hover === 'lift' ? { y: -4 } : { x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={className}
        >
          {children}
        </motion.div>
      </Link>
    </MotionEffect>
  );
}

// A cover image that zooms in while its `group` card is hovered.
export function CoverImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {/* Covers come from whatever host the frontmatter names, which
          next/image would need listed in advance. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}
