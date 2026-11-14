'use client';

// The site's logo in two forms: `Logo`, simply there, and `DrawingLogo`, which
// strokes itself in and then fills. Both end as the same shape.
//
// Every outline of the drawing is its own path on its own timeline: a path's
// `pathLength` is measured over the whole path, so the small outlines of one
// compound path would all be finished long before the animation is. The mark
// draws first and the letters follow left to right, so a stroke is being drawn
// for the whole of STROKES_END, and the fill starts as the last letter closes.

import { ease } from '@animate-ui/react/utils/motion';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LOGO_LETTERS, LOGO_MARK, LOGO_VIEW_BOX } from './logo-paths';

// Seconds from the first stroke. The intro's own timings (see intro.tsx) are
// counted from LOGO_END, when the filled logo is complete.
export const STROKES_END = 1.3;
const FILL_DURATION = 0.45;
const FILL_LEAD = 0.15;
export const LOGO_END = STROKES_END - FILL_LEAD + FILL_DURATION;

const MARK_DURATION = 0.9;
const LETTER_DURATION = 0.55;
const FIRST_LETTER_AT = 0.25;
const LAST_LETTER_AT = STROKES_END - LETTER_DURATION;

const letterDelay = (letter: number) =>
  FIRST_LETTER_AT +
  (letter / (LOGO_LETTERS.length - 1)) * (LAST_LETTER_AT - FIRST_LETTER_AT);

// The outlines are stroked as well as filled, which is what keeps the logo's
// letters from thinning at the end of the drawing.
const STROKE = { stroke: 'currentColor', strokeWidth: 10 } as const;

function LogoFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      aria-hidden="true"
      className={cn('block', className)}
    >
      {children}
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <LogoFrame className={className}>
      <path
        d={[...LOGO_MARK, ...LOGO_LETTERS.flat()].join('')}
        fill="currentColor"
        {...STROKE}
      />
    </LogoFrame>
  );
}

function Outline({
  d,
  delay,
  duration,
}: {
  d: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.path
      d={d}
      {...STROKE}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration, delay, ease: 'easeInOut' }}
    />
  );
}

export function DrawingLogo({ className }: { className?: string }) {
  return (
    <LogoFrame className={className}>
      <motion.g
        fill="currentColor"
        initial={{ fillOpacity: 0 }}
        animate={{ fillOpacity: 1 }}
        transition={{
          duration: FILL_DURATION,
          delay: STROKES_END - FILL_LEAD,
          ease: ease.out,
        }}
      >
        {LOGO_MARK.map((d) => (
          <Outline key={d} d={d} delay={0} duration={MARK_DURATION} />
        ))}
        {LOGO_LETTERS.map((outlines, letter) =>
          outlines.map((d) => (
            <Outline
              key={d}
              d={d}
              delay={letterDelay(letter)}
              duration={LETTER_DURATION}
            />
          )),
        )}
      </motion.g>
    </LogoFrame>
  );
}
