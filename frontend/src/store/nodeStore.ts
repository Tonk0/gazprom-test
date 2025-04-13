import { create } from 'zustand';
import { FormattedNodeData } from '../types';

interface NodeStore {
  selectedNode: FormattedNodeData | null;
  setSelectedNode: (data: FormattedNodeData | null) => void;
}
export const useNodeStore = create<NodeStore>((set) => ({
  selectedNode: null,
  setSelectedNode: (data: FormattedNodeData | null) => set({ selectedNode: data }),
}));
