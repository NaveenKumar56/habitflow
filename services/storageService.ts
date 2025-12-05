import { Habit } from '../types';
import { DEFAULT_HABITS } from '../constants';

const STORAGE_KEY = 'habitflow_data_v1';

export const loadHabits = (): Habit[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with defaults for first-time users
      return DEFAULT_HABITS as Habit[];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load habits", error);
    return [];
  }
};

export const saveHabits = (habits: Habit[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Failed to save habits", error);
  }
};