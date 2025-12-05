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

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export interface DriveConfig {
  clientId: string;
  apiKey: string;
}