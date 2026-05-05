const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'fitness.db');

let db;

function getDb() {
  if (db) return db;

  const fs = require('fs');
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  initSchema();
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS run_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL DEFAULT (date('now')),
      distance_km REAL NOT NULL,
      duration_min REAL NOT NULL,
      pace_min_per_km REAL GENERATED ALWAYS AS (
        CASE WHEN distance_km > 0 THEN duration_min / distance_km ELSE NULL END
      ) STORED,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL DEFAULT 'other'
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL DEFAULT (date('now')),
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workout_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL DEFAULT 1,
      reps INTEGER,
      weight_kg REAL,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    );

    INSERT OR IGNORE INTO exercises (name, category) VALUES
      ('杠铃卧推', 'chest'),
      ('哑铃飞鸟', 'chest'),
      ('杠铃深蹲', 'legs'),
      ('硬拉', 'legs'),
      ('引体向上', 'back'),
      ('杠铃划船', 'back'),
      ('杠铃推举', 'shoulders'),
      ('侧平举', 'shoulders'),
      ('杠铃弯举', 'arms'),
      ('绳索下压', 'arms'),
      ('卷腹', 'core'),
      ('平板支撑', 'core'),
      ('跑步机', 'cardio'),
      ('跳绳', 'cardio');
  `);
}

module.exports = { getDb };
