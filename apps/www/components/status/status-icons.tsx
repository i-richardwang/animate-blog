'use client';

import { cn } from '@workspace/ui/lib/utils';
import {
  CheckIcon,
  TriangleAlertIcon,
  AlertCircleIcon,
  WrenchIcon,
} from 'lucide-react';
export const StatusMonitorIcon = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'flex size-[12.5px] items-center justify-center bg-muted text-background [&>svg]:size-[9px]',
      'group-data-[variant=success]/monitor:bg-success',
      'group-data-[variant=degraded]/monitor:bg-warning',
      'group-data-[variant=error]/monitor:bg-destructive',
      'group-data-[variant=info]/monitor:bg-info',
      className,
    )}
    {...props}
  >
    <CheckIcon className="hidden group-data-[variant=success]/monitor:block" />
    <TriangleAlertIcon className="hidden group-data-[variant=degraded]/monitor:block" />
    <AlertCircleIcon className="hidden group-data-[variant=error]/monitor:block" />
    <WrenchIcon className="hidden group-data-[variant=info]/monitor:block" />
  </div>
);

export const StatusMonitorStatus = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'font-mono text-sm leading-none',
      'group-data-[variant=success]/monitor:text-success',
      'group-data-[variant=degraded]/monitor:text-warning',
      'group-data-[variant=error]/monitor:text-destructive',
      'group-data-[variant=info]/monitor:text-info',
      className,
    )}
    {...props}
  >
    <span className="hidden group-data-[variant=success]/monitor:block">
      Operational
    </span>
    <span className="hidden group-data-[variant=degraded]/monitor:block">
      Degraded
    </span>
    <span className="hidden group-data-[variant=error]/monitor:block">
      Downtime
    </span>
    <span className="hidden group-data-[variant=info]/monitor:block">
      Maintenance
    </span>
  </div>
);

export const StatusBannerIcon = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'flex size-7 shrink-0 items-center justify-center bg-muted text-background [&>svg]:size-4',
      'group-data-[status=success]/status-banner:bg-success',
      'group-data-[status=degraded]/status-banner:bg-warning',
      'group-data-[status=error]/status-banner:bg-destructive',
      'group-data-[status=info]/status-banner:bg-info',
      className,
    )}
    {...props}
  >
    <CheckIcon className="hidden group-data-[status=success]/status-banner:block" />
    <TriangleAlertIcon className="hidden group-data-[status=degraded]/status-banner:block" />
    <AlertCircleIcon className="hidden group-data-[status=error]/status-banner:block" />
    <WrenchIcon className="hidden group-data-[status=info]/status-banner:block" />
  </div>
);

export const StatusBannerMessage = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div className={cn(className)} {...props}>
    <span className="hidden group-data-[status=success]/status-banner:block">
      All Systems Operational
    </span>
    <span className="hidden group-data-[status=degraded]/status-banner:block">
      Degraded Performance
    </span>
    <span className="hidden group-data-[status=error]/status-banner:block">
      System Outage
    </span>
    <span className="hidden group-data-[status=info]/status-banner:block">
      Maintenance
    </span>
  </div>
);
