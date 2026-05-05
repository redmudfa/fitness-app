import { useState, useEffect } from 'react';
import type { RunRecord } from '../types';
import { api } from '../api';

interface Props {
  refreshKey: number;
}

export function RunList({ refreshKey }: Props) {
  const [runs, setRuns] = useState<RunRecord[]>([]);

  useEffect(() => {
    api.getRuns().then(setRuns);
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    await api.deleteRun(id);
    api.getRuns().then(setRuns);
  };

  if (!runs.length) {
    return <div className="empty">暂无跑步记录，添加第一条吧 🏃</div>;
  }

  return (
    <div>
      {runs.map((r) => (
        <div className="card" key={r.id}>
          <div className="card-header">
            <span className="card-title">{r.distance_km} km</span>
            <span className="card-date">{r.date}</span>
          </div>
          <div className="card-detail">
            <span>⏱ {r.duration_min} 分钟</span>
            <span>🏃 配速 {r.pace_min_per_km ? r.pace_min_per_km.toFixed(1) + "'/km" : '--'}</span>
          </div>
          {r.notes && <div className="card-notes">{r.notes}</div>}
          <button className="btn btn-danger" onClick={() => handleDelete(r.id)}>删除</button>
        </div>
      ))}
    </div>
  );
}
