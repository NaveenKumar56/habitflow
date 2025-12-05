export interface Habit {
  id: string;
  title: string;
  category: string;
  color: string;
  createdAt: string; // ISO Date string
  logs: Record<string, boolean>; // Key is YYYY-MM-DD, Value is completed status
}

export type HabitCategory = 'Health' | 'Productivity' | 'Mindfulness' | 'Learning' | 'Social' | 'Other';

export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'stress' | 'excited';
  createdAt: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type Language = 'en' | 'ja';