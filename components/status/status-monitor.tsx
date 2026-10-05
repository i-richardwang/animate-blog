'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { MonitorData } from './types';
import { StatusTracker, StatusTrackerSkeleton } from './status-tracker';
import { StatusMonitorIcon } from './status-icons';

export const StatusMonitor = ({ monitor }: { monitor: MonitorData }) => {
  return (
    <div
      data-slot="status-monitor"
      data-variant={monitor.status}
      className="group/monitor flex flex-col gap-1"
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex min-w-0 flex-row items-center gap-2">
          <div className="truncate font-medium font-mono text-base text-foreground leading-5">
            {monitor.name}
          </div>
          <StatusMonitorDescription>
            {monitor.description}
          </StatusMonitorDescription>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="font-mono text-foreground/80 text-sm leading-none">
            {monitor.uptime}
          </div>
          <StatusMonitorIcon />
        </div>
      </div>

      <StatusTracker data={monitor.data} />

      {/* Footer */}
      <div className="flex flex-row items-center justify-between font-mono text-muted-foreground text-xs leading-none">
        <div>
          {monitor.data.length > 0
            ? formatDistanceToNowStrict(new Date(monitor.data[0].day), {
                unit: 'day',
                addSuffix: true,
              })
            : '-'}
        </div>
        <div>today</div>
      </div>
    </div>
  );
};

const StatusMonitorDescription = ({ children }: { children?: string }) => {
  const isTouch = useMediaQuery('(hover: none)');
  const [open, setOpen] = useState(false);

  if (!children) return null;

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        onClick={() => {
          if (isTouch) setOpen((prev) => !prev);
        }}
        className="rounded-full"
      >
        <InfoIcon className="size-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{children}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const StatusMonitorSkeleton = () => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-[12.5px] w-[12.5px]" />
        </div>
      </div>
      <StatusTrackerSkeleton />
      <div className="flex flex-row items-center justify-between">
        <Skeleton className="h-3 w-18" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
};
