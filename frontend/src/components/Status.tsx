import { useEffect, useState } from 'react';
import { useGroupStore } from '../store/groupStore';
import { Status as NodeStatus, statusColors } from '../types';
import { getWorsStatus } from '../helpers';

export function Status() {
  const groups = useGroupStore((state) => state.groups);
  const filteredGroups = useGroupStore((state) => state.filteredGroups);
  const [status, setStatus] = useState<NodeStatus | null>(null);
  useEffect(() => {
    if (filteredGroups.length > 0) {
      setStatus(getWorsStatus(filteredGroups));
    } else {
      setStatus(getWorsStatus(groups));
    }
  }, [groups, filteredGroups]);
  return (
    <div className="status">
      <h3>
        Статуc: {status?.description}
      </h3>
      {status?.description && (
        <div className="status-rect" style={{ backgroundColor: statusColors[status.description] }} />
      )}
    </div>
  );
}
