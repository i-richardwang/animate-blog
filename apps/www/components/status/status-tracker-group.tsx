'use client';

import { useEffect, useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { Skeleton } from '@workspace/ui/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'fumadocs-ui/components/ui/collapsible';
import type { StatusVariant } from './types';
import { StatusMonitorIcon, StatusMonitorStatus } from './status-icons';
import { StatusMonitorSkeleton } from './status-monitor';

interface StatusTrackerGroupProps {
  title: string;
  status: StatusVariant;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const StatusTrackerGroup = ({
  title,
  status,
  defaultOpen = false,
  children,
  className,
}: StatusTrackerGroupProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn(
        '-mx-3',
        'border border-transparent bg-muted/50',
        'hover:border-border/50 data-[state=open]:border-border/50 data-[state=open]:bg-muted/50',
        className,
      )}
    >
      <CollapsibleTrigger
        className={cn(
          'group/monitor flex w-full items-center justify-between gap-2 px-3 py-2 font-medium font-mono',
          'cursor-pointer',
        )}
        data-variant={status}
      >
        {title}
        <div className="flex items-center gap-2">
          <StatusMonitorStatus className="text-sm" />
          <StatusMonitorIcon />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        data-animate={mounted}
        className={cn(
          'flex flex-col gap-3 border-t border-border/50 px-3 py-2',
          'overflow-hidden',
          'data-[animate=true]:data-[state=closed]:animate-collapsible-up data-[animate=true]:data-[state=open]:animate-collapsible-down',
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const StatusTrackerGroupSkeleton = ({
  monitorCount = 2,
  className,
}: {
  monitorCount?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        '-mx-3',
        'border border-border/50 bg-muted/50',
        className,
      )}
    >
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-2 px-3 py-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-[12.5px] w-[12.5px]" />
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col gap-3 border-t border-border/50 px-3 py-2">
        {Array.from({ length: monitorCount }).map((_, i) => (
          <StatusMonitorSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
