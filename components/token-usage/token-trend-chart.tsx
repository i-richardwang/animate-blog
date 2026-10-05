'use client';

import { Bar, BarChart, CartesianGrid, Cell, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { TrendBucket, TrendGranularity } from '@/lib/token-usage/types';
import {
  formatBucketTick,
  formatBucketLabel,
  granularityLabel,
} from '@/lib/token-usage/trend-bucketing';
import { formatTokens } from '@/lib/token-usage/format';

const chartConfig = {
  tokens: {
    label: 'Tokens',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface TokenTrendChartProps {
  data: TrendBucket[];
  granularity: TrendGranularity;
}

export const TokenTrendChart = ({
  data,
  granularity,
}: TokenTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token 用量趋势</CardTitle>
        <CardDescription>
          按{granularityLabel(granularity)}统计的 Token 消耗量
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="start"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatBucketTick(value, granularity)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) =>
                    formatBucketLabel(
                      payload?.[0]?.payload as TrendBucket,
                      granularity,
                    )
                  }
                  valueFormatter={(value) => formatTokens(value)}
                />
              }
            />
            <Bar dataKey="tokens" fill="var(--color-tokens)" radius={0}>
              {/* A partial bucket covers fewer days than its neighbours, so its
                  bar is short by construction. Dim it rather than let it read
                  as a drop in usage. */}
              {data.map((bucket) => (
                <Cell
                  key={bucket.start}
                  fillOpacity={bucket.partial ? 0.4 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
