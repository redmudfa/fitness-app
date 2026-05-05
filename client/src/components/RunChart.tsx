import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartRow {
  week: string;
  week_start: string;
  total_km: number;
  count: number;
}

interface Props {
  refreshKey: number;
}

export function RunChart({ refreshKey }: Props) {
  const [data, setData] = useState<ChartRow[]>([]);

  useEffect(() => {
    fetch('/api/runs/chart')
      .then((r) => r.json())
      .then(setData);
  }, [refreshKey]);

  if (data.length === 0) return null;

  return (
    <div className="chart-card">
      <h3>📈 每周跑量趋势</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="week" stroke="#888" tick={{ fontSize: 12 }} />
          <YAxis stroke="#888" tick={{ fontSize: 12 }} unit=" km" />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#eee' }}
            formatter={(value: unknown) => [`${Number(value).toFixed(1)} km`, '跑量']}
            labelFormatter={(label: unknown, payload: unknown) => {
              const p = Array.isArray(payload) ? payload[0] : null;
              const item = (p as { payload?: ChartRow })?.payload;
              return item ? `${item.week_start}` : String(label);
            }}
          />
          <Bar dataKey="total_km" fill="#4ade80" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
