import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchGroups, fetchMetrics } from './helpers/api';
import { FirstColumn } from './components/FirstColumn';
import { useGroupStore } from './store/groupStore';
import { useMetricStore } from './store/metricStore';
import { SecondColumn } from './components/SecondColumn';

function App() {
  const { data: groups } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups, refetchInterval: 60000 });
  const { data: metrics } = useQuery({ queryKey: ['metrics'], queryFn: fetchMetrics, refetchInterval: 60000 });
  const { setGroups } = useGroupStore.getState();
  const { setMetrics } = useMetricStore.getState();
  useEffect(() => {
    if (groups) {
      setGroups(groups);
    }
  }, [groups, setGroups]);

  useEffect(() => {
    if (metrics) {
      setMetrics(metrics);
    }
  }, [metrics, setMetrics]);
  return (
    <div className="grid-layout">
      <FirstColumn />
      <SecondColumn />
      <div className="first-column">
        {}
      </div>
    </div>
  );
}

export default App;
