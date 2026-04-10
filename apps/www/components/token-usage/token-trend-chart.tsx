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
import type { DailyTrend } from '@/lib/token-usage/types';
import { formatTokens } from '@/lib/token-usage/format';

const chartConfig = {
  tokens: {
    label: 'Tokens',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface TokenTrendChartProps {
  data: DailyTrend[];
}

export const TokenTrendChart = ({ data }: TokenTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token 用量趋势</CardTitle>
        <CardDescription>按天统计的 Token 消耗量</CardDescription>
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
              tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  valueFormatter={(value) => formatTokens(value)}
                />
              }
            />
            <Bar dataKey="tokens" fill="var(--color-tokens)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
