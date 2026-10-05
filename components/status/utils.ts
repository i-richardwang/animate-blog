import type { StatusVariant } from './types';

// How each status is labelled and coloured in the trackers.
export const STATUS_META: Record<
  StatusVariant,
  { label: string; color: string }
> = {
  success: { label: 'Successful', color: 'var(--success)' },
  degraded: { label: 'Degraded', color: 'var(--warning)' },
  error: { label: 'Failed', color: 'var(--destructive)' },
  info: { label: 'Maintenance', color: 'var(--info)' },
  empty: { label: 'No data', color: 'var(--muted)' },
};

const STATUS_PRIORITY: Record<StatusVariant, number> = {
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
