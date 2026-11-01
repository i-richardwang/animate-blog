'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// The site's own Motion animations follow the user's reduced-motion setting:
// transforms (the hero's slide, hover scales) stop, opacity still fades.
// Animate UI's components handle this themselves through AnimateUIProvider.
export function ReducedMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
