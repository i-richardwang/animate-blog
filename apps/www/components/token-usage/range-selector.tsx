'use client';

import { cn } from '@workspace/ui/lib/utils';

const RANGES = [
  { value: '7d', label: '7 天' },
  { value: '30d', label: '30 天' },
  { value: '90d', label: '90 天' },
  { value: 'all', label: '全部' },
] as const;

interface RangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RangeSelector = ({ value, onChange }: RangeSelectorProps) => {
  return (
    <div className="flex w-full gap-1 border bg-muted/50 p-1">
      {RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            'flex-1 py-1.5 text-sm font-medium transition-colors',
            value === range.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};
