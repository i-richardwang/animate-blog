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
import type { BrandUsage } from '@/lib/token-usage/types';
import { formatTokens } from '@/lib/token-usage/format';

const chartConfig = {
  tokens: {
    label: 'Tokens',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface BrandUsageChartProps {
  data: BrandUsage[];
}

export const BrandUsageChart = ({ data }: BrandUsageChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>品牌用量排行</CardTitle>
        <CardDescription>按模型品牌统计的 Token 使用量</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <XAxis type="number" dataKey="tokens" hide />
            <YAxis
              dataKey="brand"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={70}
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
