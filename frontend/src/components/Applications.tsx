import { FormattedNodeData } from '../types';

interface ApplicationProps {
  selectedNode: FormattedNodeData;
}

export function Applications({ selectedNode } : ApplicationProps) {
  return (
    <>
      <h3>Приложение:</h3>
      <p style={{ marginLeft: '12px' }}>{selectedNode.application.caption}</p>
    </>
  );
}
