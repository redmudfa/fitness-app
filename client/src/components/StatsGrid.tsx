import type { Summary } from '../types';

export function StatsGrid({ data }: { data: Summary | null }) {
  if (!data) return null;
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="value">{data.total_runs}</div>
        <div className="label">跑步次数</div>
      </div>
      <div className="stat-card">
        <div className="value">{data.total_distance.toFixed(1)}</div>
        <div className="label">总跑量 (km)</div>
      </div>
      <div className="stat-card">
        <div className="value">{data.total_sessions}</div>
        <div className="label">训练次数</div>
      </div>
      <div className="stat-card">
        <div className="value">{(data.total_volume_kg / 1000).toFixed(1)}</div>
        <div className="label">总容量 (吨)</div>
      </div>
    </div>
  );
}
