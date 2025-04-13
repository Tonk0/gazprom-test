import { FormattedNodeData } from '../types';

interface InterfaceProps {
  selectedNode: FormattedNodeData;
}

export function Interface({ selectedNode }: InterfaceProps) {
  return (
    <>
      <h3>Интерфейс:</h3>
      <div className="interface">
        <p>Название: {selectedNode.interface.caption}</p>
        <div>
          <p>Статус: {selectedNode.interface.status.description}</p>
          <div style={{ backgroundColor: selectedNode.interface.status.color, width: '16px', height: '16px' }} />
        </div>
      </div>
    </>
  );
  return null;
}
