'use client';

import * as React from 'react';
import { Switch as SwitchPrimitives } from 'radix-ui';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

export function Switch({
  className,
  checked,
  onCheckedChange,
  leftIcon,
  rightIcon,
}: {
  className?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
}) {
  const [isTapped, setIsTapped] = React.useState(false);

  return (
    <SwitchPrimitives.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      asChild
    >
      <motion.button
        className={cn(
          'relative flex p-[3px] h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input data-[state=checked]:justify-end data-[state=unchecked]:justify-start',
          className,
        )}
        initial={false}
        onTapStart={() => setIsTapped(true)}
        onTapCancel={() => setIsTapped(false)}
        onTap={() => setIsTapped(false)}
      >
        <motion.div
          animate={
            checked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
          }
          transition={{ type: 'spring', bounce: 0 }}
          className="absolute [&_svg]:size-3 left-1 top-1/2 -translate-y-1/2 dark:text-neutral-500 text-neutral-400"
        >
          {leftIcon}
        </motion.div>

        <motion.div
          animate={
            checked ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
          }
          transition={{ type: 'spring', bounce: 0 }}
          className="absolute [&_svg]:size-3 right-1 top-1/2 -translate-y-1/2 dark:text-neutral-400 text-neutral-500"
        >
          {rightIcon}
        </motion.div>

        <SwitchPrimitives.Thumb asChild>
          <motion.div
            className="relative z-[1] [&_svg]:size-3 flex items-center justify-center rounded-full bg-background shadow-lg ring-0 dark:text-neutral-400 text-neutral-500"
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              width: 18,
              height: 18,
            }}
            animate={
              isTapped
                ? { width: 21, transition: { duration: 0.1 } }
                : { width: 18, transition: { duration: 0.1 } }
            }
          />
        </SwitchPrimitives.Thumb>
      </motion.button>
    </SwitchPrimitives.Root>
  );
}
