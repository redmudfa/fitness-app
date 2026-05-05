import { useState } from 'react';
import { api } from '../api';

interface Props {
  onCreated: () => void;
}

export function RunForm({ onCreated }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createRun({
      date,
      distance_km: parseFloat(distance),
      duration_min: parseFloat(duration),
      notes: notes || undefined,
    });
    setDistance('');
    setDuration('');
    setNotes('');
    onCreated();
  };

  return (
    <div className="form-section">
      <h3>➕ 添加跑步记录</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>距离 (km)</label>
            <input type="number" step="0.1" min="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="5.0" required />
          </div>
          <div className="form-group">
            <label>时长 (分钟)</label>
            <input type="number" step="1" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>备注</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="轻松跑、节奏跑..." />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">记录跑步</button>
      </form>
    </div>
  );
}
