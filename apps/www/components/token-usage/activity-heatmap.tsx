'use client';

import { useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { HeatmapDay } from '@/lib/token-usage/types';
import { formatTokens } from '@/lib/token-usage/format';

const CELL_SIZE = 12;
const CELL_GAP = 2;

const rowGridStyle = {
  gridTemplateRows: `repeat(7, minmax(${CELL_SIZE}px, 1fr))`,
  gap: `${CELL_GAP}px`,
} as const;

const INTENSITY_LEVELS = [
  'bg-muted',
  'bg-chart-1/30',
  'bg-chart-1/50',
  'bg-chart-1/75',
  'bg-chart-1',
] as const;

const CELL_CLASS = 'aspect-square min-w-3 min-h-3 rounded-[2px]';

interface DayData {
  date: string;
  value: number;
}

type WeekDays = (DayData | null)[];

interface WeekData {
  days: WeekDays;
  monthStart: number | null;
}

interface Quartiles {
  q1: number;
  q2: number;
  q3: number;
}

interface TooltipData {
  day: DayData;
  cellRect: DOMRect;
  containerRect: DOMRect;
}

function calculateQuartiles(values: number[]): Quartiles {
  const sorted = [...values].sort((a, b) => a - b);
  const len = sorted.length;
  return {
    q1: sorted[Math.floor(len * 0.25)] ?? 0,
    q2: sorted[Math.floor(len * 0.5)] ?? 0,
    q3: sorted[Math.floor(len * 0.75)] ?? 0,
  };
}

function getIntensityClass(value: number, q: Quartiles): string {
  if (value === 0) return INTENSITY_LEVELS[0];
  if (value <= q.q1) return INTENSITY_LEVELS[1];
  if (value <= q.q2) return INTENSITY_LEVELS[2];
  if (value <= q.q3) return INTENSITY_LEVELS[3];
  return INTENSITY_LEVELS[4];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function processHeatmapData(data: HeatmapDay[]) {
  const dateMap = new Map<string, number>();
  const nonZeroValues: number[] = [];
  let total = 0;
  let mostActive = { date: '', value: 0 };

  for (const item of data) {
    dateMap.set(item.date, item.value);
    total += item.value;
    if (item.value > 0) {
      nonZeroValues.push(item.value);
      if (item.value > mostActive.value) {
        mostActive = { date: item.date, value: item.value };
      }
    }
  }

  const quartiles = calculateQuartiles(nonZeroValues);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const adjustedStart = new Date(startDate);
  adjustedStart.setDate(adjustedStart.getDate() - adjustedStart.getDay());

  const adjustedEnd = new Date(endDate);
  adjustedEnd.setDate(adjustedEnd.getDate() + (6 - adjustedEnd.getDay()));

  const weeks: WeekData[] = [];
  let currentWeek: WeekDays = Array(7).fill(null);
  let currentMonthStart: number | null = null;
  let lastMonth: number | null = null;
  const current = new Date(adjustedStart);

  while (current <= adjustedEnd) {
    const dateStr = current.toISOString().split('T')[0];
    const dayOfWeek = current.getDay();
    const month = current.getMonth();
    const value = dateMap.get(dateStr) ?? 0;

    if (dayOfWeek === 0 && month !== lastMonth) {
      currentMonthStart = month;
      lastMonth = month;
    }

    currentWeek[dayOfWeek] = { date: dateStr, value };

    if (dayOfWeek === 6) {
      weeks.push({ days: currentWeek, monthStart: currentMonthStart });
      currentWeek = Array(7).fill(null);
      currentMonthStart = null;
    }

    current.setDate(current.getDate() + 1);
  }

  if (currentWeek.some((d) => d !== null)) {
    weeks.push({ days: currentWeek, monthStart: currentMonthStart });
  }

  return {
    weeks,
    quartiles,
    total,
    activeDays: nonZeroValues.length,
    mostActiveDate: mostActive,
  };
}

interface ActivityHeatmapProps {
  data: HeatmapDay[];
}

export const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const processed = useMemo(() => processHeatmapData(data), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>活动热力图</CardTitle>
        <CardDescription>近一年每日 Token 用量</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div
            className="flex flex-col gap-1"
            style={{
              minWidth: `${processed.weeks.length * (CELL_SIZE + CELL_GAP)}px`,
            }}
          >
            <div className="relative h-4">
              {processed.weeks.map((week, weekIndex) =>
                week.monthStart !== null ? (
                  <span
                    key={weekIndex}
                    className="absolute whitespace-nowrap text-[10px] text-muted-foreground"
                    style={{
                      left: `${(weekIndex / processed.weeks.length) * 100}%`,
                    }}
                  >
                    {week.monthStart + 1} 月
                  </span>
                ) : null,
              )}
            </div>

            <div ref={gridRef} className="pb-0.5 pr-0.5">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${processed.weeks.length}, minmax(${CELL_SIZE}px, 1fr))`,
                  gap: `${CELL_GAP}px`,
                }}
              >
                {processed.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid" style={rowGridStyle}>
                    {week.days.map((day, dayIndex) => {
                      if (!day) {
                        return <div key={dayIndex} className={CELL_CLASS} />;
                      }
                      return (
                        <div
                          key={dayIndex}
                          className={`${CELL_CLASS} cursor-pointer transition-colors hover:ring-1 hover:ring-foreground/30 ${getIntensityClass(day.value, processed.quartiles)}`}
                          onMouseEnter={(e) => {
                            const cellRect =
                              e.currentTarget.getBoundingClientRect();
                            const gridRect =
                              gridRef.current?.getBoundingClientRect();
                            if (gridRect) {
                              setTooltip({
                                day,
                                cellRect,
                                containerRect: gridRect,
                              });
                            }
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-1">
          <span className="mr-1 text-[10px] text-muted-foreground">少</span>
          {INTENSITY_LEVELS.map((className, i) => (
            <div key={i} className={`h-3 w-3 rounded-[2px] ${className}`} />
          ))}
          <span className="ml-1 text-[10px] text-muted-foreground">多</span>
        </div>
      </CardContent>

      {tooltip &&
        (() => {
          const { cellRect, containerRect: gridRect } = tooltip;
          const tooltipWidth = 160;
          const tooltipHeight = 60;
          const offset = 8;

          const positiveX = cellRect.right + offset;
          const negativeX = cellRect.left - tooltipWidth - offset;
          const translateX =
            positiveX + tooltipWidth > gridRect.right
              ? Math.max(negativeX, gridRect.left)
              : Math.max(positiveX, gridRect.left);

          const positiveY = cellRect.bottom + offset;
          const negativeY = cellRect.top - tooltipHeight - offset;
          const translateY =
            positiveY + tooltipHeight > gridRect.bottom
              ? Math.max(negativeY, gridRect.top)
              : Math.max(positiveY, gridRect.top);

          return (
            <div
              className="pointer-events-none fixed z-50"
              style={{ left: translateX, top: translateY }}
            >
              <div className="grid min-w-[8rem] items-start gap-1.5 border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                <div className="flex w-full flex-wrap items-stretch gap-2">
                  <div
                    className="w-1 shrink-0 bg-(--color-bg)"
                    style={{ '--color-bg': 'var(--chart-1)' } as CSSProperties}
                  />
                  <div className="flex flex-1 items-end justify-between leading-none">
                    <div className="grid gap-1.5">
                      <span className="font-medium">
                        {formatDate(tooltip.day.date)}
                      </span>
                      <span className="text-muted-foreground">Token</span>
                    </div>
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {formatTokens(tooltip.day.value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </Card>
  );
};
