export interface TokenUsageSummary {
  totalCost: number;
  totalTokens: number;
  totalCacheReadTokens: number;
  avgDailyTokens: number;
}

// One bucket of the cost/token trend. `date` is the bucket's first day
// (the day itself, the Monday of the week, or the 1st of the month).
export interface DailyTrend {
  date: string;
  cost: number;
  tokens: number;
}

// How the trend charts bucket time. Picked from the span of the selected range
// so a long window (notably "全部") doesn't render hundreds of one-day bars.
export type TrendGranularity = 'day' | 'week' | 'month';

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
  dailyTrend: DailyTrend[];
  byModel: ModelUsage[];
  byBrand: BrandUsage[];
  heatmap: HeatmapDay[];
  byProvider: ProviderUsage[];
  range: string;
  trendGranularity: TrendGranularity;
}
