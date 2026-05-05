import { useState, useEffect, useCallback } from 'react';
import { StatsGrid } from './components/StatsGrid';
import { RunForm } from './components/RunForm';
import { RunList } from './components/RunList';
import { WorkoutForm } from './components/WorkoutForm';
import { WorkoutList } from './components/WorkoutList';
import { api } from './api';
import type { Summary } from './types';

type Tab = 'runs' | 'workouts';

export default function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [tab, setTab] = useState<Tab>('runs');
  const [runKey, setRunKey] = useState(0);
  const [wkKey, setWkKey] = useState(0);

  useEffect(() => {
    api.getSummary().then(setSummary);
  }, [runKey, wkKey]);

  const onRunCreated = useCallback(() => {
    setRunKey((k) => k + 1);
  }, []);

  const onWkCreated = useCallback(() => {
    setWkKey((k) => k + 1);
  }, []);

  return (
    <div className="container">
      <header>
        <h1>🏋️ Fitness Tracker</h1>
        <p>个人健身数据追踪 · 跑步 &amp; 力量训练</p>
      </header>

      <StatsGrid data={summary} />

      <div className="tabs">
        <button
          className={`tab ${tab === 'runs' ? 'active' : ''}`}
          onClick={() => setTab('runs')}
        >
          🏃 跑步记录
        </button>
        <button
          className={`tab ${tab === 'workouts' ? 'active' : ''}`}
          onClick={() => setTab('workouts')}
        >
          💪 力量训练
        </button>
      </div>

      {tab === 'runs' && (
        <>
          <RunForm onCreated={onRunCreated} />
          <RunList refreshKey={runKey} />
        </>
      )}

      {tab === 'workouts' && (
        <>
          <WorkoutForm onCreated={onWkCreated} />
          <WorkoutList refreshKey={wkKey} />
        </>
      )}

      <footer>Fitness Tracker v1.0 · React + TypeScript + Vite · Express + SQLite</footer>
    </div>
  );
}
