import { sql, gte, and } from 'drizzle-orm';
import { getCCusageDb, getLLMeterDb } from './db';
import { usageRecords, logs } from './schema';
import {
  normalizeModelName,
  getModelBrand,
  normalizeProviderName,
} from './model-mapping';
import type {
  TokenUsageSummary,
  DailyTrend,
  ModelUsage,
  BrandUsage,
  ProviderUsage,
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

// CCusage stores one row per (device, date, agent_type), so the CLI that
// produced the usage survives into the provider breakdown instead of every
// row being attributed to Claude Code.
async function getCCusageProviders(since: Date | null) {
  const db = getCCusageDb();
  const conditions = since
    ? [gte(usageRecords.date, formatDate(since))]
    : [];

  return db
    .select({
      provider: usageRecords.agentType,
      cost: sql<number>`coalesce(sum(${usageRecords.totalCost}::numeric), 0)`,
      tokens: sql<number>`coalesce(sum(${usageRecords.totalTokens}), 0)`,
    })
    .from(usageRecords)
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(usageRecords.agentType);
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
      totalCost: sql<number>`coalesce(sum(${logs.costEffective}::numeric), 0)`,
      totalTokens: sql<number>`coalesce(sum(${logs.totalTokens}), 0)`,
    })
    .from(logs)
    .where(conditions.length ? and(...conditions) : undefined);

  return result[0];
}

async function getLLMeterCacheTokens(since: Date | null) {
  const db = getLLMeterDb();
  const conditions = since ? [gte(logs.timestamp, since)] : [];

  // Sum the native cached_read_tokens column directly. It is fully populated on
  // logs_archive and verified identical to the old token_usage JSON extraction
  // (prompt_tokens_details.cached_read_tokens), but avoids a per-row text→jsonb
  // parse of the large token_usage field.
  const result = await db
    .select({
      total: sql<number>`coalesce(sum(${logs.cachedReadTokens}), 0)`,
    })
    .from(logs)
    .where(conditions.length ? and(...conditions) : undefined);

  return Number(result[0].total);
}

async function getLLMeterDaily(since: Date | null) {
  const db = getLLMeterDb();
  const conditions = since ? [gte(logs.timestamp, since)] : [];

  return db
    .select({
      date: sql<string>`date(${logs.timestamp})`,
      cost: sql<number>`coalesce(sum(${logs.costEffective}::numeric), 0)`,
      tokens: sql<number>`coalesce(sum(${logs.totalTokens}), 0)`,
    })
    .from(logs)
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(sql`date(${logs.timestamp})`)
    .orderBy(sql`date(${logs.timestamp})`);
}

async function getLLMeterProviders(since: Date | null) {
  const db = getLLMeterDb();
  const conditions = since ? [gte(logs.timestamp, since)] : [];

  return db
    .select({
      provider: logs.provider,
      tokens: sql<number>`coalesce(sum(${logs.totalTokens}), 0)`,
      cost: sql<number>`coalesce(sum(${logs.costEffective}::numeric), 0)`,
    })
    .from(logs)
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(logs.provider);
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
    .filter(([model, tokens]) => tokens > 0 && model !== 'unknown')
    .map(([model, tokens]) => ({ model, tokens }))
    .sort((a, b) => b.tokens - a.tokens);
}

function mergeBrands(...sources: ModelUsage[][]): BrandUsage[] {
  const map = new Map<string, number>();

  for (const models of sources) {
    for (const m of models) {
      // Drop the synthetic "unknown" model (CCusage writes it when a session
      // has no resolvable model name) so it doesn't surface as an "Other" bar.
      // Headline totals are computed separately and still include it.
      if (normalizeModelName(m.model) === 'unknown') continue;
      const brand = getModelBrand(m.model);
      map.set(brand, (map.get(brand) || 0) + m.tokens);
    }
  }

  return Array.from(map.entries())
    .filter(([, tokens]) => tokens > 0)
    .map(([brand, tokens]) => ({ brand, tokens }))
    .sort((a, b) => b.tokens - a.tokens);
}

// Merge LLMeter's per-provider rows with CCusage's per-agent rows, both run
// through the same normalization so shared names (codex, opencode) collapse
// into one slice, then keep the top providers by tokens and fold the long tail
// into "其他" so the pies stay readable. The two sources cover disjoint
// traffic — CCusage's CLIs do not go through the gateway — so summing them
// double-counts nothing.
const PROVIDER_TOP_N = 7;

function mergeProviders(
  ...sources: { provider: string; tokens: number; cost: number }[][]
): ProviderUsage[] {
  const map = new Map<string, { tokens: number; cost: number }>();

  for (const p of sources.flat()) {
    const name = normalizeProviderName(p.provider);
    const e = map.get(name) ?? { tokens: 0, cost: 0 };
    e.tokens += Number(p.tokens);
    e.cost += Number(p.cost);
    map.set(name, e);
  }

  const all = Array.from(map.entries())
    .map(([provider, v]) => ({ provider, ...v }))
    .filter((p) => p.tokens > 0)
    .sort((a, b) => b.tokens - a.tokens);

  if (all.length <= PROVIDER_TOP_N) return all;

  const top = all.slice(0, PROVIDER_TOP_N);
  const rest = all.slice(PROVIDER_TOP_N).reduce(
    (acc, p) => ({ tokens: acc.tokens + p.tokens, cost: acc.cost + p.cost }),
    { tokens: 0, cost: 0 },
  );
  return [...top, { provider: '其他', ...rest }];
}

export async function fetchTokenUsage(
  range: string,
): Promise<TokenUsageResponse> {
  const now = new Date();
  const since = getDateRange(range);
  // The activity heatmap always shows a fixed trailing year, independent of the
  // range selector that drives the other charts.
  const since365 = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const [
    ccSummary,
    llSummary,
    llCacheTokens,
    ccDaily,
    llDaily,
    ccModels,
    llModels,
    llProviders,
    ccProviders,
    ccDaily365,
    llDaily365,
  ] = await Promise.all([
    getCCusageSummary(since),
    getLLMeterSummary(since),
    getLLMeterCacheTokens(since),
    getCCusageDaily(since),
    getLLMeterDaily(since),
    getCCusageModels(since),
    getLLMeterModels(since),
    getLLMeterProviders(since),
    getCCusageProviders(since),
    getCCusageDaily(since365),
    getLLMeterDaily(since365),
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

  const heatmap = mergeDailyTrends(ccDaily365, llDaily365).map((d) => ({
    date: d.date,
    value: d.tokens,
  }));

  const byProvider = mergeProviders(llProviders, ccProviders);

  return {
    summary,
    dailyTrend,
    byModel: mergeModels(ccModels, llModels),
    byBrand: mergeBrands(ccModels, llModels),
    heatmap,
    byProvider,
    range,
  };
}
