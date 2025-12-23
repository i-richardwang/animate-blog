'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { Footer } from '@/components/footer';
import { StatusBanner } from '@/components/status/status-banner';
import { StatusMonitor } from '@/components/status/status-monitor';
import {
  StatusTrackerGroup,
  StatusTrackerGroupSkeleton,
} from '@/components/status/status-tracker-group';
import type { TrackerItem, StatusVariant } from '@/components/status/types';
import type {
  UptimeKumaResponse,
  UptimeKumaGroup,
} from '@/lib/uptime-kuma/types';
import {
  transformToTrackers,
  getOverallStatusFromTrackers,
} from '@/lib/uptime-kuma/adapter';

interface ApiResponse extends UptimeKumaResponse {
  monitorNames?: Record<string, string>;
  publicGroupList?: UptimeKumaGroup[];
  error?: string;
}

export default function StatusPage() {
  const [trackers, setTrackers] = useState<TrackerItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setIsLoading(true);
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
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatus();
  }, []);

  const overallStatus = useMemo<StatusVariant>(() => {
    if (!trackers || trackers.length === 0) return 'success';
    return getOverallStatusFromTrackers(trackers);
  }, [trackers]);

  return (
    <>
      <DocsPage toc={[]} article={{ className: '!max-w-[1124px]' }}>
        <DocsTitle className="font-medium">系统状态</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          所有服务的实时状态和运行时间信息
        </DocsDescription>

        <DocsBody id="docs-body" className="pb-10 pt-4">
          {/* Status Banner */}
          <StatusBanner status={overallStatus} />

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
                <StatusTrackerGroupSkeleton monitorCount={3} className="col-span-full" />
                <StatusTrackerGroupSkeleton monitorCount={2} className="col-span-full" />
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
        </DocsBody>
      </DocsPage>
      <Footer />
    </>
  );
}
