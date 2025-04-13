import { FormattedNodeData } from '../types';

interface AdminProps {
  selectedNode: FormattedNodeData;
}

export function Admin({ selectedNode } : AdminProps) {
  return (
    <>
      <h3>Админ:</h3>
      <div className="admin">
        <p>Фамилия: {selectedNode.admin.firstname}</p>
        <p>Имя: {selectedNode.admin.lastname}</p>
        <p>Почта: {selectedNode.admin.email}</p>
      </div>
    </>
  );
}
