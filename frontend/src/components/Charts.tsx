import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { useGroupStore } from '../store/groupStore';
import { useMetricStore } from '../store/metricStore';
import { ChartData, prepareNodeUtilizationChartData, prepareUtilizationChartData } from '../helpers';
import { useNodeStore } from '../store/nodeStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  scales: {
    x: {
      ticks: {
        callback(value, index) {
          return index % 2 === 0 ? this.getLabelForValue(value) : '';
        },
      },
    },
  },
};

export function Charts() {
  const groups = useGroupStore((state) => state.groups);
  const filteredGroups = useGroupStore((state) => state.filteredGroups);
  const metrics = useMetricStore((state) => state.metrics);
  const selectedNode = useNodeStore((state) => state.selectedNode);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    if (filteredGroups.length > 0) {
      setChartData(prepareUtilizationChartData(filteredGroups, metrics));
    } else {
      setChartData(prepareUtilizationChartData(groups, metrics));
    }
    if (selectedNode) {
      setChartData(prepareNodeUtilizationChartData(selectedNode.id, metrics));
    }
  }, [filteredGroups, groups, metrics, selectedNode]);
  return (
    <div>
      {filteredGroups.length > 0 && !selectedNode && <p style={{ marginLeft: '12px' }}>Среднее по группе</p>}
      {filteredGroups.length === 0 && !selectedNode && <p style={{ marginLeft: '12px' }}>Среднее для всех групп</p>}
      {selectedNode && <p style={{ marginLeft: '12px' }}>Для конкретной ноды</p>}
      {chartData && <Line options={options} data={chartData} />}
    </div>
  );
}
