import { transformServerGroups, transformServerMetrics } from '..';
import { RawGroup, RawMetric } from '../../types';

const BASE_URL = 'http://127.0.0.1:23456/api';
export const fetchGroups = async () => {
  const response = await fetch(`${BASE_URL}/groups`, {
    method: 'GET',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  const rawData: RawGroup[] = await response.json();

  return transformServerGroups(rawData);
};

export const fetchMetrics = async () => {
  const response = await fetch(`${BASE_URL}/metrics`, {
    method: 'GET',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  const rawData: RawMetric[] = await response.json();

  return transformServerMetrics(rawData);
};
