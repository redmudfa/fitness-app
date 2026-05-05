export interface RunRecord {
  id: number;
  date: string;
  distance_km: number;
  duration_min: number;
  pace_min_per_km: number | null;
  notes: string | null;
  created_at: string;
}

export interface Exercise {
  id: number;
  name: string;
  category: string;
}

export interface WorkoutSet {
  id: number;
  session_id: number;
  exercise_id: number;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  exercise_name: string;
  category: string;
}

export interface WorkoutSession {
  id: number;
  date: string;
  notes: string | null;
  exercises: WorkoutSet[];
  created_at: string;
}

export interface Summary {
  total_runs: number;
  total_distance: number;
  total_sessions: number;
  total_volume_kg: number;
}
