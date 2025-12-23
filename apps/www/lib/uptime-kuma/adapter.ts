import type { Heartbeat, HeartbeatStatus, UptimeKumaGroup } from './types';
import type {
  MonitorData,
  MonitorGroup,
  StatusVariant,
  TrackerDayData,
  TrackerItem,
} from '@/components/status/types';
import { getHighestStatus } from '@/components/status/utils';

const STATUS_MAP: Record<HeartbeatStatus, StatusVariant> = {
  0: 'error', // DOWN
  1: 'success', // UP
  2: 'degraded', // PENDING
  3: 'info', // MAINTENANCE
};

function parseTime(timeStr: string): Date {
  const normalized = timeStr.replace(' ', 'T');
  return new Date(normalized);
}

function formatPing(ping: number | null): string {
  if (ping === null) return 'N/A';
  if (ping < 1000) return `${ping}ms`;
  return `${(ping / 1000).toFixed(1)}s`;
}

function getStatusLabel(status: StatusVariant): string {
  switch (status) {
    case 'success':
      return 'Up';
    case 'error':
      return 'Down';
    case 'degraded':
      return 'Degraded';
    case 'info':
      return 'Maintenance';
    default:
      return 'Unknown';
  }
}

export function generateTrackerData(
  heartbeats: Heartbeat[],
  groupSize: number = 2,
): TrackerDayData[] {
  if (heartbeats.length === 0) {
    return [];
  }

  // Sort heartbeats by time (oldest first for display left to right)
  const sorted = [...heartbeats].sort(
    (a, b) => parseTime(a.time).getTime() - parseTime(b.time).getTime(),
  );

  // Group heartbeats into chunks
  const groups: Heartbeat[][] = [];
  for (let i = 0; i < sorted.length; i += groupSize) {
    groups.push(sorted.slice(i, i + groupSize));
  }

  // Convert each group to a tracker data point
  return groups.map((group) => {
    const segmentHeight = 100 / group.length;

    // Create bar segments (oldest at bottom, newest at top)
    const bar = group.map((hb) => ({
      status: STATUS_MAP[hb.status] || ('empty' as StatusVariant),
      height: segmentHeight,
    }));

    // Create card items with time info
    const card = group.map((hb) => {
      const status = STATUS_MAP[hb.status] || ('empty' as StatusVariant);
      const time = parseTime(hb.time);
      const timeStr = time.toLocaleTimeString('default', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        status,
        value: `${timeStr} · ${getStatusLabel(status)} · ${formatPing(hb.ping)}`,
      };
    });

    // Use the latest time in the group as the day reference
    const latestTime = parseTime(group[group.length - 1].time);

    return {
      day: latestTime.toISOString(),
      bar,
      card,
    };
  });
}

export function calculateUptime(heartbeats: Heartbeat[]): string {
  if (heartbeats.length === 0) return '100%';

  const upCount = heartbeats.filter((hb) => hb.status === 1).length;
  const percentage = Math.round((upCount / heartbeats.length) * 10000) / 100;

  return `${percentage}%`;
}

export function getCurrentStatus(heartbeats: Heartbeat[]): StatusVariant {
  if (heartbeats.length === 0) return 'empty';

  // Sort by time descending and get the most recent
  const sorted = [...heartbeats].sort(
    (a, b) => parseTime(b.time).getTime() - parseTime(a.time).getTime(),
  );

  return STATUS_MAP[sorted[0].status] || 'empty';
}

export function transformToTrackers(
  heartbeatList: Record<string, Heartbeat[]>,
  uptimeList: Record<string, number>,
  publicGroupList: UptimeKumaGroup[],
): TrackerItem[] {
  // Sort groups by weight
  const sortedGroups = [...publicGroupList].sort((a, b) => a.weight - b.weight);

  return sortedGroups.map((group) => {
    // Generate MonitorData for each monitor in the group
    const monitors: MonitorData[] = group.monitorList.map((monitor) => {
      const monitorId = String(monitor.id);
      const heartbeats = heartbeatList[monitorId] || [];

      // Get uptime from uptimeList
      const uptimeKey720 = `${monitorId}_720`;
      const uptimeKey24 = `${monitorId}_24`;
      const uptimeValue = uptimeList[uptimeKey720] ?? uptimeList[uptimeKey24];

      const uptime = uptimeValue
        ? `${Math.round(uptimeValue * 10000) / 100}%`
        : calculateUptime(heartbeats);

      return {
        id: monitorId,
        name: monitor.name,
        status: getCurrentStatus(heartbeats),
        uptime,
        data: generateTrackerData(heartbeats),
      };
    });

    // Calculate group status from monitors
    const groupStatus = getHighestStatus(monitors.map((m) => m.status));

    const monitorGroup: MonitorGroup = {
      id: group.id,
      name: group.name,
      weight: group.weight,
      status: groupStatus,
      monitors,
    };

    return {
      type: 'group' as const,
      group: monitorGroup,
    };
  });
}

export function getOverallStatusFromTrackers(
  trackers: TrackerItem[],
): StatusVariant {
  if (trackers.length === 0) return 'success';

  const allStatuses: StatusVariant[] = trackers.flatMap((tracker) => {
    if (tracker.type === 'monitor') {
      return [tracker.monitor.status];
    }
    return tracker.group.monitors.map((m) => m.status);
  });

  return getHighestStatus(allStatuses);
}
