'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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
import type { DailyTrend, TrendGranularity } from '@/lib/token-usage/types';
import {
  formatTokens,
  formatTrendTick,
  formatTrendLabel,
  granularityLabel,
} from '@/lib/token-usage/format';

const chartConfig = {
  tokens: {
    label: 'Tokens',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface TokenTrendChartProps {
  data: DailyTrend[];
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
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatTrendTick(value, granularity)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) =>
                    formatTrendLabel(String(value), granularity)
                  }
                  valueFormatter={(value) => formatTokens(value)}
                />
              }
            />
            <Bar dataKey="tokens" fill="var(--color-tokens)" radius={0} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
