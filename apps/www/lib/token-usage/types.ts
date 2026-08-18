export interface TokenUsageSummary {
  totalCost: number;
  totalTokens: number;
  totalCacheReadTokens: number;
  avgDailyTokens: number;
}

// One day of usage. The daily series is the single source the trend buckets,
// the heatmap and the daily average are all derived from.
export interface DailyPoint {
  date: string;
  cost: number;
  tokens: number;
}

// How the trend charts fold time. Picked from the span of the selected range
// so a long window (notably "全部") doesn't render hundreds of one-day bars.
export type TrendGranularity = 'day' | 'week' | 'month';

// One bar of the trend charts. `start` is the bucket's first day; `partial`
// marks a bucket the window only partly covers — the in-progress week/month,
// or the first one on "全部" — whose bar is short for a reason other than a
// drop in usage.
export interface TrendBucket {
  start: string;
  cost: number;
  tokens: number;
  partial: boolean;
}

export interface ModelUsage {
  model: string;
  tokens: number;
}

export interface BrandUsage {
  brand: string;
  tokens: number;
}

// One day's token total for the activity heatmap (fixed 1-year window).
export interface HeatmapDay {
  date: string;
  value: number;
}

// Token + cost per provider. CCusage has no provider field, so its whole usage
// is bucketed as a single "Claude Code" provider alongside the LLMeter gateway
// providers; only the LLMeter half is available at provider granularity.
export interface ProviderUsage {
  provider: string;
  tokens: number;
  cost: number;
}

export interface TokenUsageResponse {
  summary: TokenUsageSummary;
  trend: TrendBucket[];
  byModel: ModelUsage[];
  byBrand: BrandUsage[];
  heatmap: HeatmapDay[];
  byProvider: ProviderUsage[];
  range: string;
  trendGranularity: TrendGranularity;
}
