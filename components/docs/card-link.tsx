'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { cn } from '@/lib/utils';

// A list entry that slides in `delay` ms after it scrolls into view and moves
// on hover: cards lift, rows nudge right.
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
    <Effect slide={{ offset: 30 }} fade inView delay={delay}>
      <Link href={href}>
        <motion.div
          whileHover={hover === 'lift' ? { y: -4 } : { x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={className}
        >
          {children}
        </motion.div>
      </Link>
    </Effect>
  );
}

// A card's cover image. It fills the box `className` sizes; `sizes` tells
// the browser how wide that is. `eager` loads it at once, for a cover that
// is the first thing on the page.
export function CoverImage({
  src,
  alt,
  sizes,
  eager = false,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  className: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        className="object-cover"
      />
    </div>
  );
}
