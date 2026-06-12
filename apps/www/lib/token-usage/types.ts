export interface TokenUsageSummary {
  totalCost: number;
  totalTokens: number;
  totalCacheReadTokens: number;
  avgDailyTokens: number;
}

export interface DailyTrend {
  date: string;
  cost: number;
  tokens: number;
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
  dailyTrend: DailyTrend[];
  byModel: ModelUsage[];
  byBrand: BrandUsage[];
  heatmap: HeatmapDay[];
  byProvider: ProviderUsage[];
  range: string;
}
