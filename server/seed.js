const { getDb } = require('./db');

const db = getDb();

// Clear existing data
db.exec('DELETE FROM workout_sets; DELETE FROM workout_sessions; DELETE FROM run_records;');

// Seed run records (past 14 days)
const insertRun = db.prepare(
  'INSERT INTO run_records (date, distance_km, duration_min, notes) VALUES (?, ?, ?, ?)'
);
const runs = [
  ['2026-04-21', 5.0, 28, '轻松跑'],
  ['2026-04-23', 3.2, 18, '晨跑'],
  ['2026-04-25', 10.0, 55, '长距离 LSD'],
  ['2026-04-27', 5.0, 26, '配速跑'],
  ['2026-04-29', 4.0, 22, '恢复跑'],
  ['2026-05-01', 8.0, 44, '节奏跑'],
  ['2026-05-03', 5.0, 27, '晨跑'],
  ['2026-05-05', 6.0, 32, '中度跑'],
];
for (const r of runs) insertRun.run(...r);

// Seed workout sessions
const insertSession = db.prepare(
  'INSERT INTO workout_sessions (date, notes) VALUES (?, ?)'
);
const insertSet = db.prepare(
  'INSERT INTO workout_sets (session_id, exercise_id, set_number, reps, weight_kg) VALUES (?, ?, ?, ?, ?)'
);
const exercises = db.prepare('SELECT id, name FROM exercises').all();
const exMap = {};
for (const e of exercises) exMap[e.name] = e.id;

const sessions = [
  {
    date: '2026-05-04', notes: '胸+三头',
    exercises: [
      { name: '杠铃卧推', sets: [{ reps: 10, weight: 60 }, { reps: 8, weight: 70 }, { reps: 6, weight: 80 }, { reps: 8, weight: 70 }] },
      { name: '哑铃飞鸟', sets: [{ reps: 12, weight: 14 }, { reps: 12, weight: 14 }, { reps: 10, weight: 16 }] },
      { name: '绳索下压', sets: [{ reps: 15, weight: 20 }, { reps: 12, weight: 25 }, { reps: 10, weight: 30 }] },
    ],
  },
  {
    date: '2026-05-02', notes: '背+二头',
    exercises: [
      { name: '引体向上', sets: [{ reps: 8, weight: 0 }, { reps: 6, weight: 0 }, { reps: 5, weight: 0 }, { reps: 5, weight: 0 }] },
      { name: '杠铃划船', sets: [{ reps: 10, weight: 50 }, { reps: 8, weight: 60 }, { reps: 8, weight: 60 }, { reps: 10, weight: 50 }] },
      { name: '杠铃弯举', sets: [{ reps: 12, weight: 20 }, { reps: 10, weight: 25 }, { reps: 8, weight: 30 }] },
    ],
  },
  {
    date: '2026-04-28', notes: '腿部训练',
    exercises: [
      { name: '杠铃深蹲', sets: [{ reps: 10, weight: 80 }, { reps: 8, weight: 100 }, { reps: 5, weight: 120 }, { reps: 5, weight: 120 }, { reps: 8, weight: 100 }] },
      { name: '硬拉', sets: [{ reps: 8, weight: 100 }, { reps: 5, weight: 120 }, { reps: 5, weight: 140 }] },
      { name: '卷腹', sets: [{ reps: 20, weight: 0 }, { reps: 20, weight: 0 }, { reps: 15, weight: 0 }] },
    ],
  },
];

for (const s of sessions) {
  const { lastInsertRowid } = insertSession.run(s.date, s.notes);
  for (const ex of s.exercises) {
    const eid = exMap[ex.name];
    for (let i = 0; i < ex.sets.length; i++) {
      insertSet.run(lastInsertRowid, eid, i + 1, ex.sets[i].reps, ex.sets[i].weight > 0 ? ex.sets[i].weight : null);
    }
  }
}

console.log('Seed data inserted: %d runs, %d workout sessions', runs.length, sessions.length);
