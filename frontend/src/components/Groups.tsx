import { useGroupStore } from "../store/groupStore"
import { getUniqueGroups } from "../helpers";
import { MouseEvent, useState } from "react";

export const Groups = () => {
  const { setFilteredGroups } = useGroupStore.getState();
  const groups = useGroupStore((state) => state.groups);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(-1);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.value === '-1') {
      setSelectedGroupId(-1);
      setFilteredGroups([]);
      return;
    }
    setSelectedGroupId(Number(e.currentTarget.value))
    setFilteredGroups(groups.filter((group) => group.group.id.toString() === e.currentTarget.value))
  }
  return (
    <div className="groups">
      <h3>Группы</h3>
      <div className="groups-button-list">
        <button value="-1" onClick={handleClick} className={`gray ${selectedGroupId === -1 ? 'selected' : ''}`}>Все</button>
        {getUniqueGroups(groups).map((group) => (
          <button onClick={handleClick} value={group.id} key={group.id} className={`${group.id % 2 === 0 ? 'gray' : ''} ${selectedGroupId === group.id ? 'selected' : ''}`}>{group.caption}</button>
        ))}
      </div>
    </div>
  )
}
