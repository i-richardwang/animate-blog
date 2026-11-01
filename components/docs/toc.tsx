'use client';

// The table of contents, plugged into DocsPage through `slots.toc.main`. It
// has the sidebar's look (see animated-nav.tsx); instead of one bar per
// heading, a single primary bar stretches over every heading in view.

import { useScrollFade } from '@animate-ui/react/primitives/effects/scroll-fade';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { TOCItem, type TOCItemType } from 'fumadocs-core/toc';
import {
  TOCScrollArea,
  useActiveAnchors,
  useTOCItems,
} from 'fumadocs-ui/components/toc';
import type { TOCProps } from 'fumadocs-ui/layouts/docs/page/slots/toc';
import { TextAlignLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import {
  AnimatedNav,
  indicatorTransition,
  NavItemContent,
  NavSectionTitle,
  useNavHover,
} from './animated-nav';

function Item({ item, active }: { item: TOCItemType; active: boolean }) {
  const { hovered, hoverProps } = useNavHover(item.url);
  return (
    <TOCItem
      href={item.url}
      data-toc-item={item.url}
      className="relative flex items-center py-1.5 pr-1 pl-4 text-start [overflow-wrap:anywhere]"
      {...hoverProps}
    >
      <NavItemContent
        active={active}
        hovered={hovered}
        activeBar={false}
        depth={Math.max(0, item.depth - 2)}
      >
        {item.title}
      </NavItemContent>
    </TOCItem>
  );
}

type Range = { top: number; height: number } | null;

function RangeBar({
  list,
  active,
}: {
  list: RefObject<HTMLDivElement | null>;
  active: string[];
}) {
  const reduce = useShouldReduceMotion();
  const [range, setRange] = useState<Range>(null);

  useLayoutEffect(() => {
    const element = list.current;
    if (!element) return;
    const measure = () => {
      const items = active.flatMap((id) => {
        const item = element.querySelector<HTMLElement>(
          `[data-toc-item="#${CSS.escape(id)}"]`,
        );
        return item ? [item] : [];
      });
      if (items.length === 0) return setRange(null);
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const top = first.offsetTop + first.offsetHeight * 0.22;
      const bottom = last.offsetTop + last.offsetHeight * 0.78;
      setRange({ top, height: bottom - top });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [list, active]);

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute top-0 left-[8px] z-11 w-[3px] rounded-full bg-primary"
      initial={false}
      animate={
        range
          ? { y: range.top, height: range.height, opacity: 1 }
          : { opacity: 0 }
      }
      transition={reduce ? { duration: 0 } : indicatorTransition}
    />
  );
}

export function TOC({ container }: TOCProps) {
  const items = useTOCItems();
  const active = useActiveAnchors();
  const list = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  useScrollFade(scroll, { size: 24, blur: 0 });

  if (items.length === 0)
    return (
      <div
        id="nd-toc-placeholder"
        className="hidden xl:layout:[--fd-toc-width:268px]"
      />
    );

  return (
    <div
      id="nd-toc"
      {...container}
      className="sticky top-(--fd-docs-row-1) flex h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] w-(--fd-toc-width) flex-col pt-24 pe-4 pb-18 [grid-area:toc] max-xl:hidden xl:layout:[--fd-toc-width:268px]"
    >
      <p className="mb-2 px-2">
        <NavSectionTitle
          icon={<HugeiconsIcon icon={TextAlignLeftIcon} strokeWidth={2} />}
        >
          On this page
        </NavSectionTitle>
      </p>
      <TOCScrollArea
        ref={scroll}
        className="overscroll-none px-0 pt-0 mask-none"
      >
        <AnimatedNav>
          <div ref={list} className="relative ml-2 flex flex-col">
            <RangeBar list={list} active={active} />
            {items.map((item) => (
              <Item
                key={item.url}
                item={item}
                active={active.includes(item.url.slice(1))}
              />
            ))}
          </div>
        </AnimatedNav>
      </TOCScrollArea>
    </div>
  );
}
