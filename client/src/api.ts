import type { RunRecord, WorkoutSession, Exercise, Summary } from './types';

const BASE = '/api';

async function fetchJSON<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  getSummary: () => fetchJSON<Summary>(`${BASE}/summary`),

  getRuns: () => fetchJSON<RunRecord[]>(`${BASE}/runs`),
  createRun: (data: Partial<RunRecord>) =>
    fetchJSON<RunRecord>(`${BASE}/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  deleteRun: (id: number) => fetchJSON(`${BASE}/runs/${id}`, { method: 'DELETE' }),

  getWorkouts: () => fetchJSON<WorkoutSession[]>(`${BASE}/workouts`),
  createWorkout: (data: {
    date?: string;
    notes?: string;
    exercises: { name: string; sets: { reps: number; weight_kg: number }[] }[];
  }) =>
    fetchJSON(`${BASE}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  deleteWorkout: (id: number) =>
    fetchJSON(`${BASE}/workouts/${id}`, { method: 'DELETE' }),

  getExercises: () => fetchJSON<Exercise[]>(`${BASE}/exercises`),
};
