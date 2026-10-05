'use client';

import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ProviderUsage } from '@/lib/token-usage/types';
import { formatTokens, formatCost } from '@/lib/token-usage/format';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

interface ProviderUsageChartProps {
  data: ProviderUsage[];
  metric: 'tokens' | 'cost';
  title: string;
  description: string;
  // Shared provider→color ordering so the same provider keeps one color across
  // the tokens and cost pies.
  colorOrder: string[];
}

export const ProviderUsageChart = ({
  data,
  metric,
  title,
  description,
  colorOrder,
}: ProviderUsageChartProps) => {
  const valueFormatter = metric === 'cost' ? formatCost : formatTokens;

  const { chartConfig, chartData } = useMemo(() => {
    // Key the config by a safe identifier (p0, p1, …) rather than the provider
    // name: names can contain spaces (e.g. "Claude Code"), which would make the
    // generated `--color-<name>` CSS variable invalid. The display name lives in
    // `label`, and the shared color index keeps a provider's color stable across
    // the tokens and cost pies.
    const config: ChartConfig = { [metric]: { label: title } };
    const colorIndex = new Map(colorOrder.map((name, i) => [name, i]));

    const processed = data
      .filter((p) => p[metric] > 0)
      .map((p) => {
        const i = colorIndex.get(p.provider) ?? 0;
        const key = `p${i}`;
        config[key] = {
          label: p.provider,
          color: COLORS[i % COLORS.length],
        };
        return { ...p, key, fill: `var(--color-${key})` };
      });

    return { chartConfig: config, chartData: processed };
  }, [data, metric, title, colorOrder]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="key"
                  hideLabel
                  valueFormatter={(value) => valueFormatter(value)}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey={metric}
              nameKey="key"
              innerRadius={60}
              outerRadius={100}
            />
            <ChartLegend
              content={
                <ChartLegendContent nameKey="key" className="flex-wrap" />
              }
              verticalAlign="bottom"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
