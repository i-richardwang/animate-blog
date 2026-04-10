'use client';

import { cn } from '@workspace/ui/lib/utils';
import { Skeleton } from '@workspace/ui/components/ui/skeleton';

interface StatCardProps extends React.ComponentProps<'div'> {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({
  className,
  title,
  value,
  description,
  icon,
  ...props
}: StatCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 border bg-card p-4',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon && (
          <span className="text-muted-foreground">{icon}</span>
        )}
      </div>
      <div className="font-mono text-2xl font-semibold tracking-tight">
        {value}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export const StatCardSkeleton = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('flex flex-col gap-2 border bg-card p-4', className)}
      {...props}
    >
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
};
