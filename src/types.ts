
export interface Habit {
  id: string;
  title: string;
  category: string;
  color: string;
  createdAt: string; // ISO Date string
  logs: Record<string, boolean>; // Key is YYYY-MM-DD, Value is completed status
}

export type HabitCategory = 'Health' | 'Productivity' | 'Mindfulness' | 'Learning' | 'Social' | 'Other';

export interface DayStat {
  date: string;
  completedCount: number;
  totalHabits: number;
}

export interface User {
  id: string;
  email: string;
  username?: string; // Metadata
  role?: 'admin' | 'user';
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'stress' | 'excited';
  createdAt: string;
}

export type Language = 'en' | 'ja';
