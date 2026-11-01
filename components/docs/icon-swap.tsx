'use client';

// Swaps one icon for another, the old one shrinking and blurring out while the
// new one grows in: a copy button's clipboard turning into a tick.

import { blur, scale, transition } from '@animate-ui/react/utils/motion';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const HIDDEN = { scale: scale.icon, opacity: 0, filter: blur.icon };
const SHOWN = { scale: 1, opacity: 1, filter: 'blur(0px)' };

export function IconSwap({
  active,
  icon,
  activeIcon,
  size,
  className,
}: {
  active: boolean;
  icon: IconSvgElement;
  activeIcon: IconSvgElement;
  size: number;
  className?: string;
}) {
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
          <HugeiconsIcon
            icon={active ? activeIcon : icon}
            strokeWidth={2}
            size={size}
          />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
