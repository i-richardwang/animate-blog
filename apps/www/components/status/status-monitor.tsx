'use client';

import { useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { Skeleton } from '@workspace/ui/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { MonitorData } from './types';
import { StatusTracker, StatusTrackerSkeleton } from './status-tracker';
import { StatusMonitorIcon } from './status-icons';

interface StatusMonitorProps extends React.ComponentProps<'div'> {
  monitor: MonitorData;
  isLoading?: boolean;
}

export const StatusMonitor = ({
  className,
  monitor,
  isLoading = false,
  ...props
}: StatusMonitorProps) => {
  return (
    <div
      data-slot="status-monitor"
      data-variant={monitor.status}
      className={cn('group/monitor flex flex-col gap-1', className)}
      {...props}
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
          {isLoading ? (
            <StatusMonitorUptimeSkeleton />
          ) : (
            <StatusMonitorUptime>{monitor.uptime}</StatusMonitorUptime>
          )}
          <StatusMonitorIcon />
        </div>
      </div>

      {/* Tracker */}
      {isLoading ? (
        <StatusTrackerSkeleton />
      ) : (
        <StatusTracker data={monitor.data} />
      )}

      {/* Footer */}
      <StatusMonitorFooter data={monitor.data} isLoading={isLoading} />
    </div>
  );
};

const StatusMonitorDescription = ({
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof TooltipTrigger>) => {
  const isTouch = useMediaQuery('(hover: none)');
  const [open, setOpen] = useState(false);

  if (!children) return null;

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        onClick={(e) => {
          if (isTouch) setOpen((prev) => !prev);
          onClick?.(e);
        }}
        className="rounded-full"
        {...props}
      >
        <InfoIcon className="size-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{children}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const StatusMonitorUptime = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn('font-mono text-foreground/80 text-sm leading-none', className)}
    >
      {children}
    </div>
  );
};

const StatusMonitorUptimeSkeleton = ({
  className,
  ...props
}: React.ComponentProps<typeof Skeleton>) => {
  return <Skeleton className={cn('h-4 w-16', className)} {...props} />;
};

const StatusMonitorFooter = ({
  data,
  isLoading,
}: {
  data: MonitorData['data'];
  isLoading?: boolean;
}) => {
  return (
    <div className="flex flex-row items-center justify-between font-mono text-muted-foreground text-xs leading-none">
      <div>
        {isLoading ? (
          <Skeleton className="h-3 w-18" />
        ) : data.length > 0 ? (
          formatDistanceToNowStrict(new Date(data[0].day), {
            unit: 'day',
            addSuffix: true,
          })
        ) : (
          '-'
        )}
      </div>
      <div>today</div>
    </div>
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
