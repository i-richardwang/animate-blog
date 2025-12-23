import { NextResponse } from 'next/server';
import type { UptimeKumaGroup } from '@/lib/uptime-kuma/types';

const UPTIME_KUMA_URL =
  process.env.UPTIME_KUMA_URL ||
  process.env.NEXT_PUBLIC_UPTIME_KUMA_URL ||
  'https://status.homelab.wang';
const UPTIME_KUMA_SLUG =
  process.env.UPTIME_KUMA_SLUG ||
  process.env.NEXT_PUBLIC_UPTIME_KUMA_SLUG ||
  'homelab';

export async function GET() {
  try {
    // Fetch heartbeat data
    const heartbeatResponse = await fetch(
      `${UPTIME_KUMA_URL}/api/status-page/heartbeat/${UPTIME_KUMA_SLUG}`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 60, // Cache for 60 seconds
        },
      },
    );

    if (!heartbeatResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch heartbeat: ${heartbeatResponse.statusText}` },
        { status: heartbeatResponse.status },
      );
    }

    const heartbeatData = await heartbeatResponse.json();

    // Fetch status page config for monitor names and groups
    const monitorNames: Record<string, string> = {};
    let publicGroupList: UptimeKumaGroup[] = [];
    try {
      const configResponse = await fetch(
        `${UPTIME_KUMA_URL}/api/status-page/${UPTIME_KUMA_SLUG}`,
        {
          headers: {
            Accept: 'application/json',
          },
          next: {
            revalidate: 300, // Cache config for 5 minutes
          },
        },
      );

      if (configResponse.ok) {
        const configData = await configResponse.json();
        if (configData.publicGroupList) {
          publicGroupList = configData.publicGroupList;
          for (const group of configData.publicGroupList) {
            if (group.monitorList) {
              for (const monitor of group.monitorList) {
                monitorNames[String(monitor.id)] = monitor.name;
              }
            }
          }
        }
      }
    } catch {
      // Ignore errors fetching config
    }

    return NextResponse.json({
      ...heartbeatData,
      monitorNames,
      publicGroupList,
    });
  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status data' },
      { status: 500 },
    );
  }
}
