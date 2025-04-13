export type Statuses = 'UNREACHABLE' | 'SHUTDOWN' | 'UP' | 'WARNING' | 'CRITICAL' | 'DOWN';
export type Colors = 'black' | 'grey' | 'lightgreen' | 'yellow' | 'red' | 'darkred';

export const statusColors: Record<Statuses, Colors> = {
  UNREACHABLE: 'black',
  SHUTDOWN: 'grey',
  UP: 'lightgreen',
  WARNING: 'yellow',
  CRITICAL: 'red',
  DOWN: 'darkred',
};

export interface Status {
  id: number;
  color: Colors;
  description: Statuses;
}

export interface Admin {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Group {
  id: number;
  caption: string;
}

export interface Interface {
  id: number;
  caption: string;
  status: Status;
}

export interface Application {
  id: number;
  caption: string;
}

export interface Node {
  id: number;
  caption: string;
  status: Status;
  admin: Admin;
  interface: Interface;
  application: Application
}

export interface RawGroup {
  group_id: number;
  group_caption: string;
  node_id: number;
  node_caption: string;
  node_status_id: number;
  node_status_color: Colors;
  node_status_description: string;
  interface_id: number;
  interface_caption: string;
  interface_status_id: string | number;
  interface_status_color: Colors;
  interface_status_description: string;
  application_id: number;
  application_caption: string;
  admin_id: number;
  admin_firstname: string;
  admin_lastname: string;
  admin_email: string;
}

export interface StructuredGroup {
  group: Group;
  node: Node;
}

export interface MetricNode {
  id: number;
  caption: string;
  statusId: number;
  interfaceId: number;
  adminId: number;
}

export interface Metric {
  id: number;
  datetime: string;
  cpu: number;
  memory: number;
  disk: number;
}

export interface RawMetric {
  metric_id: number;
  metric_datetime: string;
  metric_cpu_utilization: number;
  metric_memory_utilization: number;
  metric_disk_utilization: number;
  metric_node_id: number;
  node_caption: string;
  node_status_id: number;
  node_interface_id: number;
  node_admin_id: number;
}

export interface StructuredMetric {
  metric: Metric;
  node: MetricNode;
}

export interface AvgUtilization {
  averageCpu: number;
  averageMemory: number;
  averageDisk: number;
}

export interface FormattedNodeData {
  id: number;
  status: Statuses;
  color: Colors;
  caption: string;
  cpu: number;
  memory: number;
  disk: number;
  groupId: number;
}
