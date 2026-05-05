import { useState } from 'react';
import { api } from '../api';

interface SetData {
  reps: string;
  weight: string;
}

interface ExerciseRow {
  id: number;
  name: string;
  sets: SetData[];
}

interface Props {
  onCreated: () => void;
}

let rowId = 0;

function emptySet(): SetData {
  return { reps: '', weight: '' };
}

export function WorkoutForm({ onCreated }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [rows, setRows] = useState<ExerciseRow[]>([{ id: ++rowId, name: '', sets: [emptySet()] }]);

  const addRow = () => {
    setRows([...rows, { id: ++rowId, name: '', sets: [emptySet()] }]);
  };

  const removeRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  const updateName = (id: number, name: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  const addSet = (rowId: number) => {
    setRows(rows.map((r) => (r.id === rowId ? { ...r, sets: [...r.sets, emptySet()] } : r)));
  };

  const updateSet = (rowId: number, setId: number, field: keyof SetData, value: string) => {
    setRows(
      rows.map((r) =>
        r.id === rowId
          ? { ...r, sets: r.sets.map((s, i) => (i === setId ? { ...s, [field]: value } : s)) }
          : r
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const exercises = rows
      .filter((r) => r.name.trim())
      .map((r) => ({
        name: r.name.trim(),
        sets: r.sets.map((s) => ({
          reps: parseInt(s.reps) || 0,
          weight_kg: parseFloat(s.weight) || 0,
        })),
      }));
    if (!exercises.length) return;

    await api.createWorkout({ date, notes: notes || undefined, exercises });
    setNotes('');
    setRows([{ id: ++rowId, name: '', sets: [emptySet()] }]);
    onCreated();
  };

  return (
    <div className="form-section">
      <h3>➕ 添加训练记录</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>备注</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="如: 胸+三头" />
          </div>
        </div>
        {rows.map((row) => (
          <div className="exercise-row" key={row.id}>
            <div className="ex-header">
              <div className="form-group" style={{ flex: 1 }}>
                <label>动作名称</label>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => updateName(row.id, e.target.value)}
                  placeholder="如: 杠铃卧推"
                  required
                />
              </div>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeRow(row.id)} style={{ marginTop: 18 }}>
                ✕
              </button>
            </div>
            {row.sets.map((s, si) => (
              <div className="set-row" key={si}>
                <span style={{ width: 50 }}>第{si + 1}组</span>
                <input
                  type="number"
                  value={s.reps}
                  onChange={(e) => updateSet(row.id, si, 'reps', e.target.value)}
                  placeholder="次数"
                  min="0"
                  style={{ width: 80, padding: '6px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)' }}
                />
                <input
                  type="number"
                  value={s.weight}
                  onChange={(e) => updateSet(row.id, si, 'weight', e.target.value)}
                  placeholder="重量kg"
                  step="0.5"
                  min="0"
                  style={{ width: 80, padding: '6px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)' }}
                />
              </div>
            ))}
            <button type="button" className="btn btn-sm" onClick={() => addSet(row.id)} style={{ background: 'var(--border)', color: 'var(--text)', marginTop: 4 }}>
              + 添加组
            </button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="btn btn-sm" onClick={addRow} style={{ background: 'var(--border)', color: 'var(--text)' }}>
            + 添加动作
          </button>
          <button type="submit" className="btn btn-primary">记录训练</button>
        </div>
      </form>
    </div>
  );
}
