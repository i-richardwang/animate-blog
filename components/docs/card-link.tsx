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

// A cover image that zooms in while its `group` card is hovered. It fills
// the box `className` sizes; `sizes` tells the browser how wide that is.
export function CoverImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}
