'use client';

import { cn } from '@workspace/ui/lib/utils';
import { format } from 'date-fns';
import type { StatusVariant } from './types';
import { StatusBannerIcon, StatusBannerMessage } from './status-icons';

interface StatusBannerProps extends React.ComponentProps<'div'> {
  status: StatusVariant;
}

export const StatusBanner = ({
  className,
  status,
  ...props
}: StatusBannerProps) => {
  return (
    <div
      data-slot="status-banner"
      data-status={status}
      className={cn(
        'group/status-banner overflow-hidden border',
        'data-[status=success]:border-success data-[status=success]:bg-success/5 dark:data-[status=success]:bg-success/10',
        'data-[status=degraded]:border-warning data-[status=degraded]:bg-warning/5 dark:data-[status=degraded]:bg-warning/10',
        'data-[status=error]:border-destructive data-[status=error]:bg-destructive/5 dark:data-[status=error]:bg-destructive/10',
        'data-[status=info]:border-info data-[status=info]:bg-info/5 dark:data-[status=info]:bg-info/10',
        'data-[status=empty]:border-muted data-[status=empty]:bg-muted/5 dark:data-[status=empty]:bg-muted/10',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3">
        <StatusBannerIcon />
        <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
          <StatusBannerMessage className="font-semibold text-xl" />
          <span className="font-mono text-muted-foreground text-xs">
            {format(new Date(), 'LLL dd, y HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
};
