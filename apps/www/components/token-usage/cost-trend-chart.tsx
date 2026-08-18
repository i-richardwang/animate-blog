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
import type { TrendBucket, TrendGranularity } from '@/lib/token-usage/types';
import {
  formatBucketTick,
  formatBucketLabel,
  granularityLabel,
} from '@/lib/token-usage/trend-bucketing';
import { formatCost } from '@/lib/token-usage/format';

const chartConfig = {
  cost: {
    label: '成本',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface CostTrendChartProps {
  data: TrendBucket[];
  granularity: TrendGranularity;
}

// A partial bucket covers fewer days than its neighbours, so the curve dips at
// that edge for a reason other than spending less. Mark those points; the rest
// of the series stays dot-free.
const PartialDot = ({
  cx,
  cy,
  payload,
}: {
  cx?: number;
  cy?: number;
  payload?: TrendBucket;
}) => {
  if (!payload?.partial || cx == null || cy == null) return <g />;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="var(--background)"
      stroke="var(--color-cost)"
      strokeWidth={1.5}
      strokeDasharray="2 2"
    />
  );
};

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
              dot={<PartialDot />}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
