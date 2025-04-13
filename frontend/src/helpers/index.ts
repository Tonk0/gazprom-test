import {
  AvgUtilization,
  Colors, FormattedNodeData, Group, RawGroup, RawMetric, Status, Statuses, StructuredGroup,
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

export function getFormattedNodeData(
  groups: StructuredGroup[],
  metrics: StructuredMetric[],
) : FormattedNodeData[] {
  return groups.map((group) => {
    const nodeMetrics = metrics.filter((metric) => metric.node.id === group.node.id);

    const lastMetric = nodeMetrics.length > 0 ? nodeMetrics.reduce((latest, current) => {
      const latestDate = new Date(latest.metric.datetime);
      const currentDate = new Date(current.metric.datetime);
      return currentDate > latestDate ? current : latest;
    }, nodeMetrics[0]) : null;

    return {
      id: group.node.id,
      groupId: group.group.id,
      status: group.node.status.description,
      color: group.node.status.color,
      caption: group.node.caption,
      cpu: lastMetric?.metric.cpu ?? 0,
      memory: lastMetric?.metric.memory ?? 0,
      disk: lastMetric?.metric.disk ?? 0,
      admin: group.node.admin,
      application: group.node.application,
      interface: group.node.interface,
    };
  });
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export function prepareUtilizationChartData(
  groups: StructuredGroup[],
  metrics: StructuredMetric[],
): ChartData {
  const nodeIds = groups.map((group) => group.node.id);
  const relevantMetrics = metrics.filter((metric) => nodeIds.includes(metric.node.id));

  if (relevantMetrics.length === 0) {
    return {
      labels: [],
      datasets: [
        { label: 'CPU', data: [] },
        { label: 'Memory', data: [] },
        { label: 'Disk', data: [] },
      ],
    };
  }

  // Группируем метрики по времени
  const metricsByTime: { [datetime: string]: StructuredMetric[] } = {};
  relevantMetrics.forEach((metric) => {
    const { datetime } = metric.metric;
    if (!metricsByTime[datetime]) {
      metricsByTime[datetime] = [];
    }
    metricsByTime[datetime].push(metric);
  });

  // Сортируем временные метки
  const sortedTimes = Object.keys(metricsByTime)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const cpuData: number[] = [];
  const memoryData: number[] = [];
  const diskData: number[] = [];

  sortedTimes.forEach((time) => {
    const timeMetrics = metricsByTime[time];
    const totalCpu = timeMetrics.reduce((sum, metric) => sum + metric.metric.cpu, 0);
    const totalMemory = timeMetrics.reduce((sum, metric) => sum + metric.metric.memory, 0);
    const totalDisk = timeMetrics.reduce((sum, metric) => sum + metric.metric.disk, 0);

    const avgCpu = Math.round((totalCpu / timeMetrics.length) * 100) / 100;
    const avgMemory = Math.round((totalMemory / timeMetrics.length) * 100) / 100;
    const avgDisk = Math.round((totalDisk / timeMetrics.length) * 100) / 100;

    cpuData.push(avgCpu);
    memoryData.push(avgMemory);
    diskData.push(avgDisk);
  });

  // Форматируем даты для отображения на графике
  const formattedLabels = sortedTimes.map((time) => new Date(time).toLocaleString());

  return {
    labels: formattedLabels,
    datasets: [
      {
        label: 'CPU',
        data: cpuData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Memory',
        data: memoryData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Disk',
        data: diskData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
}

export function prepareNodeUtilizationChartData(
  nodeId: number,
  metrics: StructuredMetric[],
): ChartData {
  const nodeMetrics = metrics.filter((metric) => metric.node.id === nodeId);

  if (nodeMetrics.length === 0) {
    return {
      labels: [],
      datasets: [
        { label: 'CPU', data: [] },
        { label: 'Memory', data: [] },
        { label: 'Disk', data: [] },
      ],
    };
  }

  const metricsByTime: { [datetime: string]: StructuredMetric[] } = {};
  nodeMetrics.forEach((metric) => {
    const { datetime } = metric.metric;
    if (!metricsByTime[datetime]) {
      metricsByTime[datetime] = [];
    }
    metricsByTime[datetime].push(metric);
  });

  const sortedTimes = Object.keys(metricsByTime)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Здесь не нужно вычислять среднее, так как у нас только одна нода
  const cpuData: number[] = [];
  const memoryData: number[] = [];
  const diskData: number[] = [];

  sortedTimes.forEach((time) => {
  // Берем первую метрику для каждой временной точки
  // (должна быть всего одна для ноды в каждый момент)
    const metric = metricsByTime[time][0];

    cpuData.push(metric.metric.cpu);
    memoryData.push(metric.metric.memory);
    diskData.push(metric.metric.disk);
  });

  const formattedLabels = sortedTimes.map((time) => new Date(time).toLocaleString());

  return {
    labels: formattedLabels,
    datasets: [
      {
        label: 'CPU',
        data: cpuData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Memory',
        data: memoryData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Disk',
        data: diskData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
}
