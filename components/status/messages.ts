import type { StatusVariant } from './types';

export const requests: Record<StatusVariant, string> = {
  success: 'Successful',
  degraded: 'Degraded',
  error: 'Failed',
  info: 'Maintenance',
  empty: 'No data',
};
