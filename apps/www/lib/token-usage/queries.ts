import { sql, gte, and } from 'drizzle-orm';
import { getCCusageDb, getLLMeterDb } from './db';
import { usageRecords, logs } from './schema';
import { normalizeModelName, getModelBrand } from './model-mapping';
import type {
  TokenUsageSummary,
  DailyTrend,
  ModelUsage,
  BrandUsage,
  TokenUsageResponse,
} from './types';

function getDateRange(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case 'all':
      return null;
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

// Nominal length of the selected range in days. Used as the denominator for
// the daily average so it matches what the reader picked (e.g. "最近 30 天" → ÷30),
// instead of dividing by only the days that happened to have usage. Returns null
// for 'all', where there is no fixed period and we fall back to the actual span.
function getRangeDays(range: string): number | null {
  switch (range) {
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
    case 'all':
      return null;
    default:
      return 30;
  }
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

// Fill every calendar date in [start, end] so days with no usage show up as 0
// rather than being skipped. Keeps the trend chart's x-axis evenly spaced and
// honest about idle days, matching the selected period.
function fillDailyGaps(
  trends: DailyTrend[],
  start: Date,
  end: Date,
): DailyTrend[] {
  const byDate = new Map(trends.map((t) => [t.date, t]));
  const result: DailyTrend[] = [];
  const cursor = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
  );
  const last = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );

  while (cursor.getTime() <= last) {
    const key = formatDate(cursor);
    result.push(byDate.get(key) || { date: key, cost: 0, tokens: 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

// ============================================================
// CCusage queries
// ============================================================

async function getCCusageSummary(since: Date | null) {
  const db = getCCusageDb();
  const conditions = since
    ? [gte(usageRecords.date, formatDate(since))]
    : [];

  const result = await db
    .select({
      totalCost: sql<number>`coalesce(sum(${usageRecords.totalCost}::numeric), 0)`,
      totalTokens: sql<number>`coalesce(sum(${usageRecords.totalTokens}), 0)`,
      totalCacheReadTokens: sql<number>`coalesce(sum(${usageRecords.cacheReadTokens}), 0)`,
    })
    .from(usageRecords)
    .where(conditions.length ? and(...conditions) : undefined);

  return result[0];
}

async function getCCusageDaily(since: Date | null) {
  const db = getCCusageDb();
  const conditions = since
    ? [gte(usageRecords.date, formatDate(since))]
    : [];

  return db
    .select({
      date: usageRecords.date,
      cost: sql<number>`coalesce(sum(${usageRecords.totalCost}::numeric), 0)`,
      tokens: sql<number>`coalesce(sum(${usageRecords.totalTokens}), 0)`,
    })
    .from(usageRecords)
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(usageRecords.date)
    .orderBy(usageRecords.date);
}

async function getCCusageModels(since: Date | null) {
  const db = getCCusageDb();

  const result = await db.execute(sql`
    SELECT
      model::text as model,
      sum(total_tokens) as tokens
    FROM usage_records,
      jsonb_array_elements_text(models_used) as model
    ${since ? sql`WHERE date >= ${formatDate(since)}` : sql``}
    GROUP BY model
    ORDER BY tokens DESC
    LIMIT 20
  `);

  return (result.rows as { model: string; tokens: string }[]).map((r) => ({
    model: r.model,
    tokens: Number(r.tokens),
  }));
}

// ============================================================
// LLMeter queries
// ============================================================

async function getLLMeterSummary(since: Date | null) {
  const db = getLLMeterDb();
  const conditions = since ? [gte(logs.timestamp, since)] : [];

  const result = await db
    .select({
      totalCost: sql<number>`coalesce(sum(${logs.cost}::numeric), 0)`,
      totalTokens: sql<number>`coalesce(sum(${logs.totalTokens}), 0)`,
    })
    .from(logs)
    .where(conditions.length ? and(...conditions) : undefined);

  return result[0];
}

async function getLLMeterCacheTokens(since: Date | null) {
  const db = getLLMeterDb();

  const result = await db.execute(sql`
    SELECT coalesce(sum((token_usage::jsonb -> 'prompt_tokens_details' ->> 'cached_read_tokens')::bigint), 0) as total
    FROM logs
    WHERE token_usage IS NOT NULL
      AND token_usage <> ''
      AND length(token_usage) > 2
      AND token_usage::jsonb -> 'prompt_tokens_details' ->> 'cached_read_tokens' IS NOT NULL
      ${since ? sql`AND timestamp >= ${since}` : sql``}
  `);

  return Number((result.rows[0] as { total: string }).total);
}

async function getLLMeterDaily(since: Date | null) {
  const db = getLLMeterDb();
  const conditions = since ? [gte(logs.timestamp, since)] : [];

  return db
    .select({
      date: sql<string>`date(${logs.timestamp})`,
      cost: sql<number>`coalesce(sum(${logs.cost}::numeric), 0)`,
      tokens: sql<number>`coalesce(sum(${logs.totalTokens}), 0)`,
    })
    .from(logs)
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(sql`date(${logs.timestamp})`)
    .orderBy(sql`date(${logs.timestamp})`);
}

async function getLLMeterModels(since: Date | null) {
  const db = getLLMeterDb();
  const conditions = since ? [gte(logs.timestamp, since)] : [];

  const result = await db
    .select({
      model: logs.model,
      tokens: sql<number>`coalesce(sum(${logs.totalTokens}), 0)`,
    })
    .from(logs)
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(logs.model)
    .orderBy(sql`sum(${logs.totalTokens}) desc`)
    .limit(20);

  return result.map((r) => ({
    model: r.model,
    tokens: Number(r.tokens),
  }));
}

// ============================================================
// Aggregation
// ============================================================

function mergeDailyTrends(
  ...sources: { date: string; cost: number; tokens: number }[][]
): DailyTrend[] {
  const map = new Map<string, DailyTrend>();

  for (const rows of sources) {
    for (const row of rows) {
      const dateStr = String(row.date);
      const existing = map.get(dateStr) || { date: dateStr, cost: 0, tokens: 0 };
      existing.cost += Number(row.cost);
      existing.tokens += Number(row.tokens);
      map.set(dateStr, existing);
    }
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function mergeModels(...sources: ModelUsage[][]): ModelUsage[] {
  const map = new Map<string, number>();

  for (const models of sources) {
    for (const m of models) {
      const normalized = normalizeModelName(m.model);
      map.set(normalized, (map.get(normalized) || 0) + m.tokens);
    }
  }

  return Array.from(map.entries())
    .filter(([, tokens]) => tokens > 0)
    .map(([model, tokens]) => ({ model, tokens }))
    .sort((a, b) => b.tokens - a.tokens);
}

function mergeBrands(...sources: ModelUsage[][]): BrandUsage[] {
  const map = new Map<string, number>();

  for (const models of sources) {
    for (const m of models) {
      const brand = getModelBrand(m.model);
      map.set(brand, (map.get(brand) || 0) + m.tokens);
    }
  }

  return Array.from(map.entries())
    .filter(([, tokens]) => tokens > 0)
    .map(([brand, tokens]) => ({ brand, tokens }))
    .sort((a, b) => b.tokens - a.tokens);
}

export async function fetchTokenUsage(
  range: string,
): Promise<TokenUsageResponse> {
  const now = new Date();
  const since = getDateRange(range);

  const [
    ccSummary,
    llSummary,
    llCacheTokens,
    ccDaily,
    llDaily,
    ccModels,
    llModels,
  ] = await Promise.all([
    getCCusageSummary(since),
    getLLMeterSummary(since),
    getLLMeterCacheTokens(since),
    getCCusageDaily(since),
    getLLMeterDaily(since),
    getCCusageModels(since),
    getLLMeterModels(since),
  ]);

  const totalCost = Number(ccSummary.totalCost) + Number(llSummary.totalCost);
  const totalTokens = Number(ccSummary.totalTokens) + Number(llSummary.totalTokens);

  const mergedTrend = mergeDailyTrends(ccDaily, llDaily);

  // Window over which to fill gaps: fixed ranges start at `since`; 'all' starts
  // at the first day that actually has data. Both end at today.
  const windowStart =
    since ??
    (mergedTrend.length
      ? new Date(`${mergedTrend[0].date}T00:00:00.000Z`)
      : null);

  const dailyTrend = windowStart
    ? fillDailyGaps(mergedTrend, windowStart, now)
    : mergedTrend;

  // Denominator for the daily average: the selected period's nominal day count
  // (so "最近 30 天" divides by 30), or the actual span for 'all'.
  const periodDays = getRangeDays(range) ?? (dailyTrend.length || 1);

  const summary: TokenUsageSummary = {
    totalCost,
    totalTokens,
    totalCacheReadTokens:
      Number(ccSummary.totalCacheReadTokens) + llCacheTokens,
    avgDailyTokens: totalTokens / periodDays,
  };

  return {
    summary,
    dailyTrend,
    byModel: mergeModels(ccModels, llModels),
    byBrand: mergeBrands(ccModels, llModels),
    range,
  };
}
