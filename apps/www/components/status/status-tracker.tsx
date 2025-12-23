'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@workspace/ui/components/ui/hover-card';
import { Separator } from '@workspace/ui/components/ui/separator';
import { Skeleton } from '@workspace/ui/components/ui/skeleton';
import type { TrackerDayData, StatusVariant } from './types';
import { chartConfig } from './utils';
import { requests } from './messages';

interface StatusTrackerProps {
  data: TrackerDayData[];
}

export const StatusTracker = ({ data }: StatusTrackerProps) => {
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        pinnedIndex !== null &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setPinnedIndex(null);
      }
    };

    if (pinnedIndex !== null) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () =>
        document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [pinnedIndex]);

  useEffect(() => {
    if (focusedIndex !== null && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll('[role="button"]');
      const targetButton = buttons[focusedIndex] as HTMLElement;
      if (targetButton) {
        targetButton.focus();
      }
    }
  }, [focusedIndex]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setPinnedIndex(null);
      setFocusedIndex(null);
      setHoveredIndex(null);

      if (focusedIndex !== null) {
        const buttons =
          containerRef.current?.querySelectorAll('[role="button"]');
        const button = buttons?.[focusedIndex] as HTMLElement;
        if (button) {
          button.blur();
        }
      }

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      return;
    }

    if (focusedIndex !== null) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : data.length - 1,
          );
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev !== null && prev < data.length - 1 ? prev + 1 : 0,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          {
            const prevMonitor = containerRef.current?.closest(
              '[data-slot="status-monitor"]',
            )?.previousElementSibling;
            if (prevMonitor) {
              const prevTracker = prevMonitor.querySelector('[role="toolbar"]');
              if (prevTracker) {
                const buttons = prevTracker.querySelectorAll('[role="button"]');
                const button = buttons?.[focusedIndex] as HTMLElement;
                if (button) {
                  button.focus();
                }
              }
            }
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          {
            const nextMonitor = containerRef.current?.closest(
              '[data-slot="status-monitor"]',
            )?.nextElementSibling;
            if (nextMonitor) {
              const nextTracker = nextMonitor.querySelector('[role="toolbar"]');
              if (nextTracker) {
                const buttons = nextTracker.querySelectorAll('[role="button"]');
                const button = buttons?.[focusedIndex] as HTMLElement;
                if (button) {
                  button.focus();
                }
              }
            }
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleBarClick(focusedIndex);
          break;
      }
    }
  };

  const handleBarClick = (index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (pinnedIndex === index) {
      setPinnedIndex(null);
    } else {
      setPinnedIndex(index);
    }
  };

  const handleBarFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBarBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const isMovingToAnotherBar =
      relatedTarget &&
      relatedTarget.closest('[role="toolbar"]') === containerRef.current &&
      relatedTarget.getAttribute('role') === 'button';

    if (!isMovingToAnotherBar) {
      setFocusedIndex(null);
    }
  };

  const handleBarMouseEnter = (index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredIndex(index);
  };

  const handleBarMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 100);
  };

  const handleHoverCardMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleHoverCardMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div
      ref={containerRef}
      className="flex h-[50px] w-full items-end"
      onKeyDown={handleKeyDown}
      role="toolbar"
      aria-label="Status tracker"
    >
      {data.map((item, index) => {
        const isPinned = pinnedIndex === index;
        const isFocused = focusedIndex === index;
        const isHovered = hoveredIndex === index;

        return (
          <HoverCard
            key={item.day}
            openDelay={0}
            closeDelay={0}
            open={isPinned || isFocused || isHovered}
          >
            <HoverCardTrigger asChild>
              <div
                className={cn(
                  'group relative mx-px flex h-full w-full cursor-pointer flex-col outline-none first:ml-0 last:mr-0 hover:opacity-80 focus-visible:opacity-80 focus-visible:ring-[2px] focus-visible:ring-ring/50 data-[aria-pressed=true]:opacity-80',
                  'overflow-hidden',
                )}
                onClick={() => handleBarClick(index)}
                onFocus={() => handleBarFocus(index)}
                onBlur={handleBarBlur}
                onMouseEnter={() => handleBarMouseEnter(index)}
                onMouseLeave={handleBarMouseLeave}
                tabIndex={
                  index === data.length - 1 && focusedIndex === null
                    ? 0
                    : isFocused
                      ? 0
                      : -1
                }
                role="button"
                aria-label={`Day ${index + 1} status`}
                aria-pressed={isPinned}
              >
                {item.bar.map((segment, segmentIndex) => (
                  <div
                    key={`${item.day}-${segment.status}-${segmentIndex}`}
                    className="w-full transition-all"
                    style={{
                      height: `${segment.height}%`,
                      backgroundColor: chartConfig[segment.status].color,
                    }}
                  />
                ))}
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              side="top"
              align="center"
              className="![animation-duration:0ms] ![transition-duration:0ms] w-auto min-w-40 p-0"
              onMouseEnter={handleHoverCardMouseEnter}
              onMouseLeave={handleHoverCardMouseLeave}
            >
              <div>
                <div className="p-2 text-xs">
                  {new Date(item.day).toLocaleDateString('default', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <Separator />
                <div className="space-y-1 p-2 text-sm">
                  {item.card.map((cardItem, cardIndex) => (
                    <StatusTrackerContent
                      key={`${item.day}-card-${cardIndex}`}
                      status={cardItem.status}
                      value={cardItem.value}
                    />
                  ))}
                </div>
                {isPinned && (
                  <>
                    <Separator />
                    <div className="flex cursor-pointer items-center p-2 text-muted-foreground text-xs">
                      <span>Click again to unpin</span>
                      <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-xs">
                        Esc
                      </kbd>
                    </div>
                  </>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
}

export const StatusTrackerSkeleton = ({
  className,
  ...props
}: React.ComponentProps<typeof Skeleton>) => {
  return (
    <Skeleton
      className={cn('h-[50px] w-full rounded-none bg-muted', className)}
      {...props}
    />
  );
}

const StatusTrackerContent = ({
  status,
  value,
}: {
  status: StatusVariant;
  value: string;
}) => {
  return (
    <div className="flex items-baseline gap-4">
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-sm"
          style={{
            backgroundColor: chartConfig[status].color,
          }}
        />
        <div className="text-sm">{requests[status]}</div>
      </div>
      <div className="ml-auto font-mono text-muted-foreground text-xs tracking-tight">
        {value}
      </div>
    </div>
  );
}
