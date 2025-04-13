import { create } from 'zustand';
import { StructuredGroup } from '../types';

interface GroupStore {
  groups: StructuredGroup[];
  setGroups: (data: StructuredGroup[]) => void;
  filteredGroups: StructuredGroup[];
  setFilteredGroups: (filteredData: StructuredGroup[]) => void;
}
export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  setGroups: (data: StructuredGroup[]) => set({ groups: data }),
  filteredGroups: [],
  setFilteredGroups: (filteredData: StructuredGroup[]) => set({ filteredGroups: filteredData }),
}));
