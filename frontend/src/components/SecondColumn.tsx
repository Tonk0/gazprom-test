import { useEffect, useState } from 'react';
import { useGroupStore } from '../store/groupStore';
import { FormattedNodeData } from '../types';
import { getFormattedNodeData } from '../helpers';
import { useMetricStore } from '../store/metricStore';
import { useNodeStore } from '../store/nodeStore';

export function SecondColumn() {
  const groups = useGroupStore((state) => state.groups);
  const filteredGroups = useGroupStore((state) => state.filteredGroups);
  const metrics = useMetricStore((state) => state.metrics);
  const { setSelectedNode } = useNodeStore.getState();
  const [formattedNodes, setFormattedNodes] = useState<FormattedNodeData[] | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number>(-1);

  useEffect(() => {
    if (filteredGroups.length > 0) {
      setFormattedNodes(getFormattedNodeData(filteredGroups, metrics));
    } else {
      setFormattedNodes(getFormattedNodeData(groups, metrics));
    }
  }, [groups, filteredGroups, metrics]);

  const handleClick = (node: FormattedNodeData | null) => {
    setSelectedNode(node);
    setSelectedNodeId(node?.id ?? -1);
  };

  return (
    <div className="column-wrapper">
      <div className="node-list">
        <button onClick={() => handleClick(null)} className={`${selectedNodeId === -1 ? 'selected' : ''} all`} type="button">Все</button>
        {formattedNodes?.map((node) => (
          <button
            onClick={() => handleClick(node)}
            key={node.id}
            type="button"
            className={`${node.id % 2 === 0 ? 'gray' : ''} ${selectedNodeId === node.id ? 'selected' : ''}`}
          >
            <div className="node-list-status">
              {node.status}
              <div style={{ backgroundColor: node.color, width: '60%', height: '10px' }} />
            </div>
            {node.caption}
            <div className="node-list-util">
              <p className={`${node.cpu > 85 ? 'yellow' : ''} ${node.cpu > 95 ? 'red' : ''}`}>Утилизация cpu: {node.cpu}</p>
              <p className={`${node.memory > 85 ? 'yellow' : ''} ${node.memory > 95 ? 'red' : ''}`}>Утилизация memory: {node.memory}</p>
              <p className={`${node.disk > 85 ? 'yellow' : ''} ${node.disk > 95 ? 'red' : ''}`}>Утилизация disk: {node.disk}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
