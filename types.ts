export interface Habit {
  id: string;
  title: string;
  category: string;
  color: string;
  createdAt: string; // ISO Date string
  logs: Record<string, boolean>; // Key is YYYY-MM-DD, Value is completed status
}

export type HabitCategory = 'Health' | 'Productivity' | 'Mindfulness' | 'Learning' | 'Social' | 'Other';

export interface AIHabitSuggestion {
  title: string;
  category: HabitCategory;
  reason: string;
}

export interface DayStat {
  date: string;
  completedCount: number;
  totalHabits: number;
}

export interface User {
  username: string;
  password: string; // Stored locally, ideally hashed but plain for this demo
  displayName: string;
}

export type Language = 'en' | 'ja';