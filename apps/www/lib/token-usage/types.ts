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

export interface TokenUsageResponse {
  summary: TokenUsageSummary;
  dailyTrend: DailyTrend[];
  byModel: ModelUsage[];
  byBrand: BrandUsage[];
  range: string;
}
