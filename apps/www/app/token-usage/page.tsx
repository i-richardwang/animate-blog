'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { Coins, Cpu, TrendingUp, Database } from 'lucide-react';
import { Footer } from '@/components/footer';
import { StatCard, StatCardSkeleton } from '@/components/token-usage/stat-card';
import { CostTrendChart } from '@/components/token-usage/cost-trend-chart';
import { TokenTrendChart } from '@/components/token-usage/token-trend-chart';
import { ModelUsageChart } from '@/components/token-usage/model-usage-chart';
import { BrandUsageChart } from '@/components/token-usage/brand-usage-chart';
import { ProviderUsageChart } from '@/components/token-usage/provider-usage-chart';
import { ActivityHeatmap } from '@/components/token-usage/activity-heatmap';
import { RangeSelector } from '@/components/token-usage/range-selector';
import type { TokenUsageResponse } from '@/lib/token-usage/types';
import { formatCost, formatTokens } from '@/lib/token-usage/format';

export default function TokenUsagePage() {
  const [data, setData] = useState<TokenUsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [range, setRange] = useState('30d');

  const fetchData = useCallback(async (r: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/token-usage?range=${r}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result: TokenUsageResponse = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  return (
    <>
      <DocsPage toc={[]} article={{ className: '!max-w-[1124px]' }}>
        <DocsTitle className="font-medium">Token 用量</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          AI Token 使用量和成本的实时统计与趋势分析
        </DocsDescription>

        <DocsBody id="docs-body" className="pb-10 pt-4">
          {/* Range Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <RangeSelector value={range} onChange={setRange} />
          </div>

          {/* Error State */}
          {error && (
            <div className="mt-4 border border-destructive bg-destructive/10 p-4 text-destructive">
              <p className="font-medium">加载失败</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : data ? (
              <>
                <StatCard
                  title="总成本"
                  value={formatCost(data.summary.totalCost)}
                  icon={<Coins className="size-4" />}
                />
                <StatCard
                  title="总 Token"
                  value={formatTokens(data.summary.totalTokens)}
                  icon={<Cpu className="size-4" />}
                />
                <StatCard
                  title="日均 Token"
                  value={formatTokens(data.summary.avgDailyTokens)}
                  icon={<TrendingUp className="size-4" />}
                />
                <StatCard
                  title="缓存命中率"
                  value={
                    data.summary.totalTokens > 0
                      ? `${((data.summary.totalCacheReadTokens / data.summary.totalTokens) * 100).toFixed(1)}%`
                      : 'N/A'
                  }
                  icon={<Database className="size-4" />}
                />
              </>
            ) : null}
          </div>

          {/* Charts */}
          {!isLoading && data && (
            <>
              <div className="mt-6">
                <ActivityHeatmap data={data.heatmap} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CostTrendChart
                  data={data.trend}
                  granularity={data.trendGranularity}
                />
                <TokenTrendChart
                  data={data.trend}
                  granularity={data.trendGranularity}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ModelUsageChart data={data.byModel} />
                <BrandUsageChart data={data.byBrand} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ProviderUsageChart
                  data={data.byProvider}
                  metric="tokens"
                  title="服务商 Token 占比"
                  description="按服务商统计的 Token 使用量"
                  colorOrder={data.byProvider.map((p) => p.provider)}
                />
                <ProviderUsageChart
                  data={data.byProvider}
                  metric="cost"
                  title="服务商成本占比"
                  description="按服务商统计的成本"
                  colorOrder={data.byProvider.map((p) => p.provider)}
                />
              </div>
            </>
          )}

          {/* Loading Charts */}
          {isLoading && (
            <>
              <div className="mt-6 h-[280px] animate-pulse border bg-card" />
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-[370px] animate-pulse border bg-card" />
                <div className="h-[370px] animate-pulse border bg-card" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-[370px] animate-pulse border bg-card" />
                <div className="h-[370px] animate-pulse border bg-card" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-[440px] animate-pulse border bg-card" />
                <div className="h-[440px] animate-pulse border bg-card" />
              </div>
            </>
          )}
        </DocsBody>
      </DocsPage>
      <Footer />
    </>
  );
}
