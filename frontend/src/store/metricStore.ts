import { create } from 'zustand';
import { StructuredMetric } from '../types';

interface MetricStore {
  metrics: StructuredMetric[];
  setMetrics: (data: StructuredMetric[]) => void;
}
export const useMetricStore = create<MetricStore>((set) => ({
  metrics: [],
  setMetrics: (data: StructuredMetric[]) => set({ metrics: data }),
}));
