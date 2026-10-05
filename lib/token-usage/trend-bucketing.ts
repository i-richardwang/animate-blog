import type { DailyPoint, TrendBucket, TrendGranularity } from './types';

// Everything about folding the daily series into the trend charts' buckets:
// which granularity a window gets, where a bucket starts, and how a bucket is
// labelled. These belong together — changing a threshold without revisiting
// the labels produces a chart that lies about what a bar covers.

export function formatIsoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

// Daily bars stay readable up to about a quarter; past that (in practice the
// "全部" range, which spans the whole history) they collapse into a solid
// block, so the chart steps up to weeks and then to months.
const WEEK_THRESHOLD_DAYS = 100;
const MONTH_THRESHOLD_DAYS = 400;

export function pickGranularity(spanDays: number): TrendGranularity {
  if (spanDays <= WEEK_THRESHOLD_DAYS) return 'day';
  if (spanDays <= MONTH_THRESHOLD_DAYS) return 'week';
  return 'month';
}

// First day of the bucket a date falls in: the day itself, the ISO week's
// Monday, or the 1st of the month.
function bucketStart(date: string, granularity: TrendGranularity): string {
  if (granularity === 'day') return date;

  const d = parseIsoDate(date);
  if (granularity === 'month') {
    return formatIsoDate(
      new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)),
    );
  }

  // getUTCDay() counts from Sunday; shift it so Monday is 0.
  const offset = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - offset);
  return formatIsoDate(d);
}

// How many days a full bucket starting on this date would hold.
function bucketLength(start: string, granularity: TrendGranularity): number {
  if (granularity === 'day') return 1;
  if (granularity === 'week') return 7;

  const d = parseIsoDate(start);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
}

// Fold the gap-filled daily series into buckets. The input is dense, so a
// bucket can only be short at the two edges — the in-progress week/month at
// the end, and (on "全部") the first one, which starts mid-period because
// that is where the data begins. Both are flagged `partial`: their bars are
// genuinely lower than a full period's and would otherwise read as a slump.
export function bucketTrend(
  daily: DailyPoint[],
  granularity: TrendGranularity,
): TrendBucket[] {
  const map = new Map<string, TrendBucket & { days: number }>();

  for (const point of daily) {
    const start = bucketStart(point.date, granularity);
    const bucket = map.get(start) ?? {
      start,
      cost: 0,
      tokens: 0,
      partial: false,
      days: 0,
    };
    bucket.cost += point.cost;
    bucket.tokens += point.tokens;
    bucket.days += 1;
    map.set(start, bucket);
  }

  return Array.from(map.values())
    .sort((a, b) => a.start.localeCompare(b.start))
    .map(({ days, ...bucket }) => ({
      ...bucket,
      partial: days < bucketLength(bucket.start, granularity),
    }));
}

// Axis tick: months show themselves, days and weeks show the starting day.
export function formatBucketTick(
  start: string,
  granularity: TrendGranularity,
): string {
  const d = parseIsoDate(start);
  if (granularity === 'month') {
    return `${d.getUTCFullYear() % 100}/${d.getUTCMonth() + 1}`;
  }
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}

// Tooltip label: spells out the period a bar covers, so a week's or month's
// total is not read as a single day's, and marks the short edge buckets.
export function formatBucketLabel(
  bucket: Pick<TrendBucket, 'start' | 'partial'>,
  granularity: TrendGranularity,
): string {
  const d = parseIsoDate(bucket.start);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;

  let label: string;
  if (granularity === 'day') {
    label = `${year}/${month}/${d.getUTCDate()}`;
  } else if (granularity === 'month') {
    label = `${year} 年 ${month} 月`;
  } else {
    const end = new Date(d);
    end.setUTCDate(end.getUTCDate() + 6);
    label = `${month}/${d.getUTCDate()} - ${end.getUTCMonth() + 1}/${end.getUTCDate()}`;
  }

  return bucket.partial ? `${label}（不完整）` : label;
}

export function granularityLabel(granularity: TrendGranularity): string {
  return granularity === 'month' ? '月' : granularity === 'week' ? '周' : '天';
}
