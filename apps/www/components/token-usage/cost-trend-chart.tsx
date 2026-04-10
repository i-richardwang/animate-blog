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
import type { DailyTrend } from '@/lib/token-usage/types';
import { formatCost } from '@/lib/token-usage/format';

const chartConfig = {
  cost: {
    label: '成本',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface CostTrendChartProps {
  data: DailyTrend[];
}

export const CostTrendChart = ({ data }: CostTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>成本趋势</CardTitle>
        <CardDescription>按天统计的 AI 使用成本 (USD)</CardDescription>
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
