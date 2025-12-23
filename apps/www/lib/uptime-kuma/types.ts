export interface UptimeKumaResponse {
  heartbeatList: Record<string, Heartbeat[]>;
  uptimeList: Record<string, number>;
}

export interface Heartbeat {
  monitorID: number;
  status: HeartbeatStatus;
  time: string;
  msg: string;
  ping: number | null;
  important?: boolean;
  duration?: number;
}

// 0 = DOWN, 1 = UP, 2 = PENDING, 3 = MAINTENANCE
export type HeartbeatStatus = 0 | 1 | 2 | 3;

export interface UptimeKumaConfig {
  baseUrl: string;
  slug: string;
}

export interface UptimeKumaMonitor {
  id: number;
  name: string;
  sendUrl: number;
  type: string;
}

export interface UptimeKumaGroup {
  id: number;
  name: string;
  weight: number;
  monitorList: UptimeKumaMonitor[];
}

export interface UptimeKumaConfigResponse {
  publicGroupList: UptimeKumaGroup[];
}
