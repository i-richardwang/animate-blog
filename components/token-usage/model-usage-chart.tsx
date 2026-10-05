'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
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
import type { ModelUsage } from '@/lib/token-usage/types';
import { formatTokens } from '@/lib/token-usage/format';

const chartConfig = {
  tokens: {
    label: 'Tokens',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

interface ModelUsageChartProps {
  data: ModelUsage[];
}

export const ModelUsageChart = ({ data }: ModelUsageChartProps) => {
  const top10 = data.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>模型用量排行</CardTitle>
        <CardDescription>Top 10 模型的 Token 使用量</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <BarChart
            accessibilityLayer
            data={top10}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <XAxis type="number" dataKey="tokens" hide />
            <YAxis
              dataKey="model"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={130}
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
            <Bar dataKey="tokens" fill="var(--color-tokens)" radius={0} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
