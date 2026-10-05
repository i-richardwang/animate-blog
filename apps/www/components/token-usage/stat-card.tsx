'use client';

import { Skeleton } from '@workspace/ui/components/ui/skeleton';

export const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1 border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="font-mono text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 border bg-card p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
};
