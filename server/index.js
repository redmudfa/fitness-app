const express = require('express');
const { getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// ── 跑步记录 ──────────────────────────────────────────────

app.get('/api/runs', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM run_records ORDER BY date DESC').all();
  res.json(rows);
});

app.post('/api/runs', (req, res) => {
  const { date, distance_km, duration_min, notes } = req.body;
  if (!distance_km || !duration_min) {
    return res.status(400).json({ error: '距离和时长为必填项' });
  }
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO run_records (date, distance_km, duration_min, notes) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(date || new Date().toISOString().slice(0, 10), distance_km, duration_min, notes || null);
  const row = db.prepare('SELECT * FROM run_records WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

app.delete('/api/runs/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM run_records WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/runs/stats', (_req, res) => {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(*) AS total_runs,
      COALESCE(SUM(distance_km), 0) AS total_distance,
      COALESCE(ROUND(SUM(duration_min) / 60.0, 1), 0) AS total_hours,
      COALESCE(ROUND(AVG(pace_min_per_km), 2), 0) AS avg_pace
    FROM run_records
  `).get();
  res.json(stats);
});

// ── 力量训练 ──────────────────────────────────────────────

app.get('/api/exercises', (_req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM exercises ORDER BY category, name').all());
});

app.get('/api/workouts', (_req, res) => {
  const db = getDb();
  const sessions = db.prepare('SELECT * FROM workout_sessions ORDER BY date DESC').all();
  const sets = db.prepare(`
    SELECT ws.*, e.name AS exercise_name, e.category
    FROM workout_sets ws
    JOIN exercises e ON ws.exercise_id = e.id
    ORDER BY ws.session_id, ws.set_number
  `).all();

  const map = new Map();
  for (const s of sessions) {
    map.set(s.id, { ...s, exercises: [] });
  }
  for (const set of sets) {
    if (map.has(set.session_id)) {
      map.get(set.session_id).exercises.push(set);
    }
  }
  res.json([...map.values()]);
});

app.post('/api/workouts', (req, res) => {
  const { date, notes, exercises } = req.body;
  if (!exercises || exercises.length === 0) {
    return res.status(400).json({ error: '至少需要一个训练动作' });
  }

  const db = getDb();
  const insertSession = db.prepare(
    'INSERT INTO workout_sessions (date, notes) VALUES (?, ?)'
  );
  const insertSet = db.prepare(
    'INSERT INTO workout_sets (session_id, exercise_id, set_number, reps, weight_kg) VALUES (?, ?, ?, ?, ?)'
  );

  const tx = db.transaction(() => {
    const { lastInsertRowid } = insertSession.run(
      date || new Date().toISOString().slice(0, 10), notes || null
    );

    for (const ex of exercises) {
      let exerciseId = ex.exercise_id;
      if (!exerciseId && ex.name) {
        const existing = db.prepare('SELECT id FROM exercises WHERE name = ?').get(ex.name);
        if (existing) {
          exerciseId = existing.id;
        } else {
          const r = db.prepare('INSERT INTO exercises (name, category) VALUES (?, ?)').run(ex.name, 'custom');
          exerciseId = r.lastInsertRowid;
        }
      }
      for (let i = 0; i < (ex.sets || []).length; i++) {
        const s = ex.sets[i];
        insertSet.run(lastInsertRowid, exerciseId, i + 1, s.reps || null, s.weight_kg || null);
      }
    }
    return lastInsertRowid;
  });

  const id = tx();
  const session = db.prepare('SELECT * FROM workout_sessions WHERE id = ?').get(id);
  res.status(201).json(session);
});

app.delete('/api/workouts/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM workout_sessions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/workouts/stats', (_req, res) => {
  const db = getDb();
  const stats = db.prepare(`
    SELECT
      COUNT(DISTINCT ws.id) AS total_sessions,
      COALESCE(SUM(ws2.reps * ws2.weight_kg), 0) AS total_volume_kg
    FROM workout_sessions ws
    LEFT JOIN workout_sets ws2 ON ws2.session_id = ws.id
  `).get();
  res.json(stats);
});

// ── 首页汇总 ──────────────────────────────────────────────

app.get('/api/summary', (_req, res) => {
  const db = getDb();
  const runStats = db.prepare(`
    SELECT COUNT(*) AS total_runs, COALESCE(SUM(distance_km),0) AS total_distance
    FROM run_records
  `).get();
  const wkStats = db.prepare(`
    SELECT COUNT(DISTINCT ws.id) AS total_sessions,
           COALESCE(SUM(ws2.reps * ws2.weight_kg), 0) AS total_volume_kg
    FROM workout_sessions ws
    LEFT JOIN workout_sets ws2 ON ws2.session_id = ws.id
  `).get();
  res.json({ ...runStats, ...wkStats });
});

// ── 启动 ──────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🏋️  Fitness App running at http://localhost:${PORT}`);
});
