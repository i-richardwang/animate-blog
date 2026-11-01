import { sql, gte } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { getCCusageDb, getLLMeterDb } from './db';
import { usageBuckets, logs } from './schema';
import {
  normalizeModelName,
  getModelBrand,
  normalizeProviderName,
} from './model-mapping';
import { pickGranularity, bucketTrend, formatIsoDate } from './trend-bucketing';
import type {
  TokenUsageSummary,
  DailyPoint,
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

// Fill every calendar date in [start, end] so days with no usage show up as 0
// rather than being skipped. Keeps the trend chart's x-axis evenly spaced and
// honest about idle days, matching the selected period.
function fillDailyGaps(
  trends: DailyPoint[],
  start: Date,
  end: Date,
): DailyPoint[] {
  const byDate = new Map(trends.map((t) => [t.date, t]));
  const result: DailyPoint[] = [];
  const cursor = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
  );
  const last = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );

  while (cursor.getTime() <= last) {
    const key = formatIsoDate(cursor);
    result.push(byDate.get(key) || { date: key, cost: 0, tokens: 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

// ============================================================
// Query building blocks
// ============================================================

// Sum of a token or cost column as a JSON number. pg returns sums of bigint,
// integer and numeric columns as strings, so every sum is cast here and the
// aggregation below never has to coerce.
const total = (column: AnyPgColumn) =>
  sql<number>`coalesce(sum(${column}), 0)::float8`;

// usage_buckets is keyed by account-calendar day, logs_archive by instant.
const ccusageSince = (since: Date | null) =>
  since ? gte(usageBuckets.date, formatIsoDate(since)) : undefined;
const llmeterSince = (since: Date | null) =>
  since ? gte(logs.timestamp, since) : undefined;

// ============================================================
// CCusage queries
// ============================================================
//
// usage_buckets is already split per (device, agent, day, hour?, model), so
// every view here is a plain sum; the hour buckets fold into their day via
// `date`.

async function getCCusageSummary(since: Date | null) {
  const db = getCCusageDb();

  const result = await db
    .select({
      totalCost: total(usageBuckets.cost),
      totalTokens: total(usageBuckets.totalTokens),
      totalCacheReadTokens: total(usageBuckets.cacheReadTokens),
    })
    .from(usageBuckets)
    .where(ccusageSince(since));

  return result[0];
}

async function getCCusageDaily(since: Date | null) {
  const db = getCCusageDb();

  return db
    .select({
      date: usageBuckets.date,
      cost: total(usageBuckets.cost),
      tokens: total(usageBuckets.totalTokens),
    })
    .from(usageBuckets)
    .where(ccusageSince(since))
    .groupBy(usageBuckets.date)
    .orderBy(usageBuckets.date);
}

// agent_type is the CLI that produced the usage (claude-code, codex, amp,
// opencode, ...); it feeds the provider breakdown next to the gateway's
// providers.
async function getCCusageProviders(since: Date | null) {
  const db = getCCusageDb();

  return db
    .select({
      provider: usageBuckets.agentType,
      cost: total(usageBuckets.cost),
      tokens: total(usageBuckets.totalTokens),
    })
    .from(usageBuckets)
    .where(ccusageSince(since))
    .groupBy(usageBuckets.agentType);
}

// Model "" (usage its source never attributed to a model) comes through as
// well; normalizeModelName() maps it to 'unknown' and the model/brand merges
// drop it, while the headline totals above still count it.
async function getCCusageModels(since: Date | null): Promise<ModelUsage[]> {
  const db = getCCusageDb();

  return db
    .select({
      model: usageBuckets.model,
      tokens: total(usageBuckets.totalTokens),
    })
    .from(usageBuckets)
    .where(ccusageSince(since))
    .groupBy(usageBuckets.model)
    .orderBy(sql`sum(${usageBuckets.totalTokens}) desc`);
}

// ============================================================
// LLMeter queries
// ============================================================

async function getLLMeterSummary(since: Date | null) {
  const db = getLLMeterDb();

  const result = await db
    .select({
      totalCost: total(logs.costEffective),
      totalTokens: total(logs.totalTokens),
    })
    .from(logs)
    .where(llmeterSince(since));

  return result[0];
}

async function getLLMeterCacheTokens(since: Date | null) {
  const db = getLLMeterDb();

  // Sum the native cached_read_tokens column directly. It is fully populated on
  // logs_archive and verified identical to the old token_usage JSON extraction
  // (prompt_tokens_details.cached_read_tokens), but avoids a per-row text→jsonb
  // parse of the large token_usage field.
  const result = await db
    .select({ total: total(logs.cachedReadTokens) })
    .from(logs)
    .where(llmeterSince(since));

  return result[0].total;
}

async function getLLMeterDaily(since: Date | null) {
  const db = getLLMeterDb();

  return db
    .select({
      date: sql<string>`date(${logs.timestamp})`,
      cost: total(logs.costEffective),
      tokens: total(logs.totalTokens),
    })
    .from(logs)
    .where(llmeterSince(since))
    .groupBy(sql`date(${logs.timestamp})`)
    .orderBy(sql`date(${logs.timestamp})`);
}

async function getLLMeterProviders(since: Date | null) {
  const db = getLLMeterDb();

  return db
    .select({
      provider: logs.provider,
      tokens: total(logs.totalTokens),
      cost: total(logs.costEffective),
    })
    .from(logs)
    .where(llmeterSince(since))
    .groupBy(logs.provider);
}

async function getLLMeterModels(since: Date | null): Promise<ModelUsage[]> {
  const db = getLLMeterDb();

  return (
    db
      .select({
        model: logs.model,
        tokens: total(logs.totalTokens),
      })
      .from(logs)
      .where(llmeterSince(since))
      // No LIMIT: one canonical model can be spread over a dozen raw names, so
      // truncating here would drop tail aliases before normalizeModelName() gets
      // to fold them back together. The consumers do their own top-N.
      .groupBy(logs.model)
      .orderBy(sql`sum(${logs.totalTokens}) desc`)
  );
}

// ============================================================
// Aggregation
// ============================================================

function mergeDailyPoints(...sources: DailyPoint[][]): DailyPoint[] {
  const map = new Map<string, DailyPoint>();

  for (const row of sources.flat()) {
    const existing = map.get(row.date) ?? {
      date: row.date,
      cost: 0,
      tokens: 0,
    };
    existing.cost += row.cost;
    existing.tokens += row.tokens;
    map.set(row.date, existing);
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

function mergeProviders(...sources: ProviderUsage[][]): ProviderUsage[] {
  const map = new Map<string, { tokens: number; cost: number }>();

  for (const p of sources.flat()) {
    const name = normalizeProviderName(p.provider);
    const e = map.get(name) ?? { tokens: 0, cost: 0 };
    e.tokens += p.tokens;
    e.cost += p.cost;
    map.set(name, e);
  }

  const all = Array.from(map.entries())
    .map(([provider, v]) => ({ provider, ...v }))
    .filter((p) => p.tokens > 0)
    .sort((a, b) => b.tokens - a.tokens);

  if (all.length <= PROVIDER_TOP_N) return all;

  const top = all.slice(0, PROVIDER_TOP_N);
  const rest = all
    .slice(PROVIDER_TOP_N)
    .reduce(
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

  const totalCost = ccSummary.totalCost + llSummary.totalCost;
  const totalTokens = ccSummary.totalTokens + llSummary.totalTokens;

  const mergedDaily = mergeDailyPoints(ccDaily, llDaily);

  // Window over which to fill gaps: fixed ranges start at `since`; 'all' starts
  // at the first day that actually has data. Both end at today.
  const windowStart =
    since ??
    (mergedDaily.length
      ? new Date(`${mergedDaily[0].date}T00:00:00.000Z`)
      : null);

  const daily = windowStart
    ? fillDailyGaps(mergedDaily, windowStart, now)
    : mergedDaily;

  // The daily series stays the source of truth; the charts only fold it.
  const trendGranularity = pickGranularity(daily.length);
  const trend = bucketTrend(daily, trendGranularity);

  // Denominator for the daily average: the selected period's nominal day count
  // (so "最近 30 天" divides by 30), or the actual span for 'all'.
  const periodDays = getRangeDays(range) ?? (daily.length || 1);

  const summary: TokenUsageSummary = {
    totalCost,
    totalTokens,
    totalCacheReadTokens: ccSummary.totalCacheReadTokens + llCacheTokens,
    avgDailyTokens: totalTokens / periodDays,
  };

  const heatmap = mergeDailyPoints(ccDaily365, llDaily365).map((d) => ({
    date: d.date,
    value: d.tokens,
  }));

  const byProvider = mergeProviders(llProviders, ccProviders);

  return {
    summary,
    trend,
    byModel: mergeModels(ccModels, llModels),
    byBrand: mergeBrands(ccModels, llModels),
    heatmap,
    byProvider,
    range,
    trendGranularity,
  };
}
