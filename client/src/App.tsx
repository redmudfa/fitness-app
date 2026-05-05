import { useState, useEffect, useCallback } from 'react';
import { StatsGrid } from './components/StatsGrid';
import { RunChart } from './components/RunChart';
import { WorkoutChart } from './components/WorkoutChart';
import { RunForm } from './components/RunForm';
import { RunList } from './components/RunList';
import { WorkoutForm } from './components/WorkoutForm';
import { WorkoutList } from './components/WorkoutList';
import { api } from './api';
import type { Summary } from './types';

type Tab = 'dashboard' | 'runs' | 'workouts';

export default function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [tab, setTab] = useState<Tab>('dashboard');
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
          className={`tab ${tab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setTab('dashboard')}
        >
          📊 数据看板
        </button>
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

      {tab === 'dashboard' && (
        <div className="charts-grid">
          <RunChart refreshKey={runKey} />
          <WorkoutChart refreshKey={wkKey} />
        </div>
      )}

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
