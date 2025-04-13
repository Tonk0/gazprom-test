import { useEffect, useState } from 'react';
import { useGroupStore } from '../store/groupStore';
import { useMetricStore } from '../store/metricStore';
import { AvgUtilization, Statuses } from '../types';
import { calculateAvgUtilization, getNodeCountByStatus } from '../helpers';

export function Details() {
  const groups = useGroupStore((state) => state.groups);
  const filteredGroups = useGroupStore((state) => state.filteredGroups);
  const metrics = useMetricStore((state) => state.metrics);

  const [avgData, setAvgData] = useState<AvgUtilization | null>(null);
  const [statusesNums, setStatusesNums] = useState<Record<Statuses, number> | null>(null);
  useEffect(() => {
    if (filteredGroups.length > 0) {
      setAvgData(calculateAvgUtilization(filteredGroups, metrics));
      setStatusesNums(getNodeCountByStatus(filteredGroups));
    } else {
      setStatusesNums(getNodeCountByStatus(groups));
      setAvgData(calculateAvgUtilization(groups, metrics));
    }
  }, [groups, filteredGroups, metrics]);
  return (
    <div className="details">
      <h3>Общая информация: </h3>
      <p>Общее количество нод: {filteredGroups.length > 0
        ? filteredGroups.length : groups.length}
      </p>
      <div>
        <p>Количество нод в каждом из статусов:</p>
        <div className="details-statuses">
          <p>&bull; В работе: {statusesNums?.UP || 0}</p>
          <p>&bull; Предупреждение: {statusesNums?.WARNING || 0}</p>
          <p>&bull; Критическое: {statusesNums?.CRITICAL || 0}</p>
          <p>&bull; Не работает: {statusesNums?.DOWN || 0}</p>
          <p>&bull; Выключено: {statusesNums?.SHUTDOWN || 0}</p>
          <p>&bull; Недоступно: {statusesNums?.UNREACHABLE || 0}</p>
        </div>
      </div>
      <div className="details-avg">
        <p>Средняя утилизация cpu: {avgData?.averageCpu}</p>
        <p>Средняя утилизация memory: {avgData?.averageMemory}</p>
        <p>Средняя утилизация disk: {avgData?.averageMemory}</p>
      </div>
    </div>
  );
}
