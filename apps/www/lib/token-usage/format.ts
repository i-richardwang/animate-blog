import type { TrendGranularity } from './types';

export function formatTokens(value: number): string {
  if (value >= 1_0000_0000)
    return `${(value / 1_0000_0000).toFixed(1)} 亿`;
  if (value >= 1_0000) return `${(value / 1_0000).toFixed(1)} 万`;
  return String(Math.round(value));
}

export function formatCost(value: number): string {
  if (value >= 100) return `$${Math.round(value)}`;
  if (value >= 1) return `$${value.toFixed(1)}`;
  return `$${value.toFixed(2)}`;
}


// Axis tick for one trend bucket: 天/周 show the bucket's start day, 月 shows
// the month itself.
export function formatTrendTick(
  date: string,
  granularity: TrendGranularity,
): string {
  const d = new Date(`${date}T00:00:00.000Z`);
  if (granularity === 'month') {
    return `${d.getUTCFullYear() % 100}/${d.getUTCMonth() + 1}`;
  }
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}

// Tooltip label: spells out the period a bar covers, so a weekly or monthly
// bucket isn't mistaken for a single day's usage.
export function formatTrendLabel(
  date: string,
  granularity: TrendGranularity,
): string {
  const d = new Date(`${date}T00:00:00.000Z`);
  const m = d.getUTCMonth() + 1;

  if (granularity === 'month') return `${d.getUTCFullYear()} 年 ${m} 月`;
  if (granularity === 'day') return `${d.getUTCFullYear()}/${m}/${d.getUTCDate()}`;

  const end = new Date(d);
  end.setUTCDate(end.getUTCDate() + 6);
  return `${m}/${d.getUTCDate()} - ${end.getUTCMonth() + 1}/${end.getUTCDate()}`;
}

export function granularityLabel(granularity: TrendGranularity): string {
  return granularity === 'month' ? '月' : granularity === 'week' ? '周' : '天';
}
