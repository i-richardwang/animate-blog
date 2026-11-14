'use client';

import { useEffect, useState } from 'react';
import { StatusBanner } from '@/components/status/status-banner';
import { StatusMonitor } from '@/components/status/status-monitor';
import {
  StatusTrackerGroup,
  StatusTrackerGroupSkeleton,
} from '@/components/status/status-tracker-group';
import { Skeleton } from '@/components/ui/skeleton';
import type { TrackerItem } from '@/components/status/types';
import type {
  UptimeKumaResponse,
  UptimeKumaGroup,
} from '@/lib/uptime-kuma/types';
import {
  transformToTrackers,
  getOverallStatusFromTrackers,
} from '@/lib/uptime-kuma/adapter';

interface ApiResponse extends UptimeKumaResponse {
  publicGroupList?: UptimeKumaGroup[];
  error?: string;
}

export function StatusBoard() {
  const [trackers, setTrackers] = useState<TrackerItem[] | null>(null);
  // When the shown data arrived: the banner's time, which is the browser's
  // and so can't be part of the prerendered page.
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/status');

        if (!response.ok) {
          throw new Error(`Failed to fetch status: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const transformedData = transformToTrackers(
          data.heartbeatList,
          data.uptimeList,
          data.publicGroupList || [],
        );

        setTrackers(transformedData);
        setUpdatedAt(new Date());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatus();
  }, []);

  return (
    <>
      {/* Status Banner */}
      {isLoading ? (
        <Skeleton className="h-[54px] rounded-none border" />
      ) : (
        <StatusBanner
          status={
            trackers && trackers.length > 0
              ? getOverallStatusFromTrackers(trackers)
              : 'empty'
          }
          updatedAt={updatedAt}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 border border-destructive bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">加载失败</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Trackers */}
      <div className="mt-8 grid grid-cols-1 gap-5 px-3 md:grid-cols-2">
        {isLoading ? (
          <>
            <StatusTrackerGroupSkeleton
              monitorCount={3}
              className="col-span-full"
            />
            <StatusTrackerGroupSkeleton
              monitorCount={2}
              className="col-span-full"
            />
          </>
        ) : trackers && trackers.length > 0 ? (
          trackers.map((tracker) => {
            if (tracker.type === 'monitor') {
              return (
                <StatusMonitor
                  key={tracker.monitor.id}
                  monitor={tracker.monitor}
                />
              );
            }
            return (
              <StatusTrackerGroup
                key={tracker.group.id}
                title={tracker.group.name}
                status={tracker.group.status}
                defaultOpen
                className="col-span-full"
              >
                {tracker.group.monitors.map((monitor) => (
                  <StatusMonitor key={monitor.id} monitor={monitor} />
                ))}
              </StatusTrackerGroup>
            );
          })
        ) : (
          <div className="col-span-full border bg-card p-8 text-center text-muted-foreground">
            暂无监控数据
          </div>
        )}
      </div>
    </>
  );
}
