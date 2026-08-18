'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
  formatCost,
  formatTrendTick,
  formatTrendLabel,
  granularityLabel,
} from '@/lib/token-usage/format';

const chartConfig = {
  cost: {
    label: '成本',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface CostTrendChartProps {
  data: DailyTrend[];
  granularity: TrendGranularity;
}

export const CostTrendChart = ({
  data,
  granularity,
}: CostTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>成本趋势</CardTitle>
        <CardDescription>
          按{granularityLabel(granularity)}统计的 AI 使用成本 (USD)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
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
                  valueFormatter={(value) => formatCost(value)}
                />
              }
            />
            <Area
              dataKey="cost"
              type="natural"
              fill="var(--color-cost)"
              fillOpacity={0.4}
              stroke="var(--color-cost)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
