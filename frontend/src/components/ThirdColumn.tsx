import { useNodeStore } from '../store/nodeStore';
import { Admin } from './Admin';
import { Applications } from './Applications';
import { Charts } from './Charts';
import { Interface } from './Interface';

export function ThirdColumn() {
  const selectedNode = useNodeStore((state) => state.selectedNode);
  return (
    <div className="column-wrapper third">
      <h3>Метрики: </h3>
      <Charts />
      {selectedNode && (
        <>
          <Interface selectedNode={selectedNode} />
          <Admin selectedNode={selectedNode} />
          <Applications selectedNode={selectedNode} />
        </>
      )}
    </div>
  );
}
