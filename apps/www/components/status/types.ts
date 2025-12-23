export type StatusVariant =
  | 'success'
  | 'degraded'
  | 'error'
  | 'info'
  | 'empty';

export interface TrackerBarSegment {
  status: StatusVariant;
  height: number; // 0-100 percentage
}

export interface TrackerCardItem {
  status: StatusVariant;
  value: string;
}

export interface TrackerDayData {
  day: string; // ISO date string
  bar: TrackerBarSegment[];
  card: TrackerCardItem[];
}

export interface MonitorData {
  id: string;
  name: string;
  description?: string;
  status: StatusVariant;
  uptime: string; // e.g., "99.95%"
  data: TrackerDayData[];
}

export interface MonitorGroup {
  id: number;
  name: string;
  weight: number;
  status: StatusVariant;
  monitors: MonitorData[];
}

export type TrackerItem =
  | { type: 'monitor'; monitor: MonitorData }
  | { type: 'group'; group: MonitorGroup };
