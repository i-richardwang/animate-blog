import type { StatusVariant } from './types';

export const chartConfig: Record<StatusVariant, { color: string }> = {
  success: { color: 'var(--success)' },
  degraded: { color: 'var(--warning)' },
  error: { color: 'var(--destructive)' },
  info: { color: 'var(--info)' },
  empty: { color: 'var(--muted)' },
};

export const STATUS_PRIORITY: Record<StatusVariant, number> = {
  error: 3,
  degraded: 2,
  info: 1,
  success: 0,
  empty: -1,
};

export function getHighestStatus(statuses: StatusVariant[]): StatusVariant {
  if (statuses.length === 0) return 'empty';

  return statuses.reduce((highest, current) => {
    return STATUS_PRIORITY[current] > STATUS_PRIORITY[highest]
      ? current
      : highest;
  }, 'empty' as StatusVariant);
}
