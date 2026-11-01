'use client';

// The site's navigation look, shared by the sidebar and the TOC: a vertical
// guide line, a primary bar that springs to the active link and a grey bar
// that follows the pointer, the label nudging right under both. One
// AnimatedNav holds the hover state of its links, so a list has one hover
// bar that glides between them.

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import {
  createContext,
  use,
  useId,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export const indicatorTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
} as const;

const labelTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
} as const;

const NavContext = createContext<{
  hovered: string | null;
  setHovered: (id: string | null) => void;
}>({ hovered: null, setHovered: () => {} });

export function AnimatedNav({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <LayoutGroup id={useId()}>
      <NavContext value={{ hovered, setHovered }}>{children}</NavContext>
    </LayoutGroup>
  );
}

export function useNavHover(id: string) {
  const { hovered, setHovered } = use(NavContext);
  return {
    hovered: hovered === id,
    hoverProps: {
      onPointerEnter: (event: PointerEvent) => {
        if (event.pointerType === 'mouse') setHovered(id);
      },
      onPointerLeave: () => setHovered(null),
    },
  };
}

export function NavItemContent({
  active,
  hovered,
  depth = 0,
  activeBar = true,
  children,
}: {
  active: boolean;
  hovered: boolean;
  /** Off for the TOC, whose RangeBar covers every active heading. */
  activeBar?: boolean;
  depth?: number;
  children: ReactNode;
}) {
  return (
    <>
      <span className="absolute inset-y-0 left-[9px] w-px bg-border" />
      <AnimatePresence initial={false}>
        {active && activeBar && (
          <motion.span
            layoutId="active-indicator"
            className="pointer-events-none absolute top-1/2 left-[8px] z-11 h-[56%] w-[3px] -translate-y-1/2 rounded-full bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={indicatorTransition}
          />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {hovered && (
          <motion.span
            layoutId="hover-indicator"
            className="pointer-events-none absolute top-1/2 left-[8px] z-10 h-[56%] w-[3px] -translate-y-1/2 rounded-full bg-neutral-300 dark:bg-neutral-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={indicatorTransition}
          />
        )}
      </AnimatePresence>
      <motion.span
        className={cn(
          'w-full text-sm text-neutral-700 transition-colors dark:text-neutral-200',
          (active || hovered) && 'text-black dark:text-white',
        )}
        style={{ paddingInlineStart: 12 + depth * 12 }}
        animate={{ x: active || hovered ? 3 : 0 }}
        transition={labelTransition}
      >
        {children}
      </motion.span>
    </>
  );
}

// The small boxed icon in front of a section heading.
export function NavSectionIcon({ children }: { children: ReactNode }) {
  return (
    <span className="relative flex size-5 items-center justify-center rounded-[5px] bg-border text-muted-foreground [&_svg]:size-[12px]">
      {children}
      <span className="absolute top-full left-1/2 h-2 w-px translate-x-[calc(-50%-0.5px)] bg-border" />
    </span>
  );
}

export function NavSectionTitle({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <NavSectionIcon>{icon}</NavSectionIcon>
      <span className="text-[13px] text-neutral-500">{children}</span>
    </span>
  );
}
