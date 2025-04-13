import {
  AvgUtilization,
  Colors, Group, RawGroup, RawMetric, Status, Statuses, StructuredGroup,
  StructuredMetric,
} from '../types';

export function transformServerGroups(data: RawGroup[]): StructuredGroup[] {
  return data.map((rawGroup) => ({
    group: {
      id: rawGroup.group_id,
      caption: rawGroup.group_caption,
    },
    node: {
      id: rawGroup.node_id,
      caption: rawGroup.node_caption,
      status: {
        id: rawGroup.node_status_id,
        color: rawGroup.node_status_color as Colors,
        description: rawGroup.node_status_description as Statuses,
      },
      admin: {
        id: rawGroup.admin_id,
        firstname: rawGroup.admin_firstname,
        lastname: rawGroup.admin_lastname,
        email: rawGroup.admin_email,
      },
      interface: {
        id: rawGroup.interface_id,
        caption: rawGroup.interface_caption,
        status: {
          id: Number(rawGroup.interface_status_id),
          color: rawGroup.interface_status_color as Colors,
          description: rawGroup.interface_status_description as Statuses,
        },
      },
      application: {
        id: rawGroup.application_id,
        caption: rawGroup.application_caption,
      },
    },
  }));
}

export function transformServerMetrics(data: RawMetric[]): StructuredMetric[] {
  return data.map((rawMetric) => ({
    metric: {
      id: rawMetric.metric_id,
      datetime: rawMetric.metric_datetime,
      cpu: rawMetric.metric_cpu_utilization,
      memory: rawMetric.metric_memory_utilization,
      disk: rawMetric.metric_disk_utilization,
    },
    node: {
      id: rawMetric.metric_node_id,
      caption: rawMetric.node_caption,
      statusId: rawMetric.node_status_id,
      interfaceId: rawMetric.node_interface_id,
      adminId: rawMetric.node_admin_id,
    },
  }));
}

export function getWorsStatus(groups: StructuredGroup[]): Status | null {
  if (!groups.length) return null;
  const statusPriority: Record<Statuses, number> = {
    DOWN: 6,
    CRITICAL: 5,
    UNREACHABLE: 4,
    WARNING: 3,
    SHUTDOWN: 2,
    UP: 1,
  };
  let worstStatus: Status | null = null;
  let highestPriority = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const group of groups) {
    const currentStatus = group.node.status;
    const currentPriority = statusPriority[currentStatus.description];

    if (currentPriority > highestPriority) {
      highestPriority = currentPriority;
      worstStatus = currentStatus;
    }
  }
  return worstStatus;
}

export function getUniqueGroups(groups: StructuredGroup[]): Group[] {
  const uniqueGroupsMap = new Map<number, Group>();

  groups.forEach(((group) => {
    if (!uniqueGroupsMap.has(group.group.id)) {
      uniqueGroupsMap.set(group.group.id, group.group);
    }
  }));

  return Array.from(uniqueGroupsMap.values());
}

export function calculateAvgUtilization(
  groups: StructuredGroup[],
  metrics: StructuredMetric[],
): AvgUtilization {
  const nodeIds = groups.map((group) => group.node.id);
  const relevantMetrics = metrics.filter((metric) => nodeIds.includes(metric.node.id));
  if (relevantMetrics.length === 0) {
    return {
      averageCpu: 0,
      averageMemory: 0,
      averageDisk: 0,
    };
  }

  const totalCpu = relevantMetrics.reduce((sum, metric) => sum + metric.metric.cpu, 0);
  const totalMemory = relevantMetrics.reduce((sum, metric) => sum + metric.metric.memory, 0);
  const totalDisk = relevantMetrics.reduce((sum, metric) => sum + metric.metric.disk, 0);

  const averageCpu = Math.round((totalCpu / relevantMetrics.length) * 100) / 100;
  const averageMemory = Math.round((totalMemory / relevantMetrics.length) * 100) / 100;
  const averageDisk = Math.round((totalDisk / relevantMetrics.length) * 100) / 100;

  return {
    averageCpu,
    averageMemory,
    averageDisk,
  };
}

export function getNodeCountByStatus(groups: StructuredGroup[]) : Record<Statuses, number> {
  const statusCounts: Record<string, number> = {};
  groups.forEach((group) => {
    const statusDesc = group.node.status.description;
    if (statusCounts[statusDesc]) {
      statusCounts[statusDesc] += 1;
    } else {
      statusCounts[statusDesc] = 1;
    }
  });
  return statusCounts;
}
