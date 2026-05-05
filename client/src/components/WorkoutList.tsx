import { useState, useEffect } from 'react';
import type { WorkoutSession } from '../types';
import { api } from '../api';

interface Props {
  refreshKey: number;
}

export function WorkoutList({ refreshKey }: Props) {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    api.getWorkouts().then(setWorkouts);
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    await api.deleteWorkout(id);
    api.getWorkouts().then(setWorkouts);
  };

  if (!workouts.length) {
    return <div className="empty">暂无训练记录，添加第一条吧 💪</div>;
  }

  return (
    <div>
      {workouts.map((w) => {
        const grouped: Record<string, typeof w.exercises> = {};
        for (const s of w.exercises) {
          if (!grouped[s.exercise_name]) grouped[s.exercise_name] = [];
          grouped[s.exercise_name].push(s);
        }
        return (
          <div className="card" key={w.id}>
            <div className="card-header">
              <span className="card-title">{w.notes || '训练记录'}</span>
              <span className="card-date">{w.date}</span>
            </div>
            {Object.entries(grouped).map(([name, sets]) => (
              <div key={name} style={{ margin: '8px 0' }}>
                <span className="badge">{name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginLeft: 8 }}>
                  {sets.map((s) => `${s.reps || 0}次${s.weight_kg ? ' × ' + s.weight_kg + 'kg' : ''}`).join(' | ')}
                </span>
              </div>
            ))}
            <button className="btn btn-danger" onClick={() => handleDelete(w.id)}>删除</button>
          </div>
        );
      })}
    </div>
  );
}
