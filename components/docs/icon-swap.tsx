'use client';

// Swaps one icon for another, the old one shrinking and blurring out while the
// new one grows in: a copy button's clipboard turning into a tick.

import { blur, scale, transition } from '@animate-ui/react/utils/motion';
import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const HIDDEN = { scale: scale.icon, opacity: 0, filter: blur.icon };
const SHOWN = { scale: 1, opacity: 1, filter: 'blur(0px)' };

export function IconSwap({
  active,
  icon: Icon,
  activeIcon: ActiveIcon,
  size,
  className,
}: {
  active: boolean;
  icon: LucideIcon;
  activeIcon: LucideIcon;
  size: number;
  className?: string;
}) {
  const Current = active ? ActiveIcon : Icon;
  return (
    <span
      data-slot="icon-swap"
      className={cn('relative flex shrink-0', className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={active ? 'active' : 'idle'}
          className="flex"
          initial={HIDDEN}
          animate={SHOWN}
          exit={HIDDEN}
          transition={transition.swap}
        >
          <Current size={size} strokeWidth={2} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
