import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartRow {
  week: string;
  week_start: string;
  sessions: number;
  volume_kg: number;
}

interface Props {
  refreshKey: number;
}

export function WorkoutChart({ refreshKey }: Props) {
  const [data, setData] = useState<ChartRow[]>([]);

  useEffect(() => {
    fetch('/api/workouts/chart')
      .then((r) => r.json())
      .then(setData);
  }, [refreshKey]);

  if (data.length === 0) return null;

  return (
    <div className="chart-card">
      <h3>📊 每周训练容量</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="week" stroke="#888" tick={{ fontSize: 12 }} />
          <YAxis stroke="#888" tick={{ fontSize: 12 }} unit=" kg" />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#eee' }}
            formatter={(value: unknown) => [`${Number(value).toFixed(0)} kg`, '训练容量']}
            labelFormatter={(label: unknown, payload: unknown) => {
              const p = Array.isArray(payload) ? payload[0] : null;
              const item = (p as { payload?: ChartRow })?.payload;
              return item ? `${item.week_start}` : String(label);
            }}
          />
          <Bar dataKey="volume_kg" fill="#60a5fa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
