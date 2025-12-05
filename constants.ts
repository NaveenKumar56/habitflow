import { HabitCategory } from './types';

export const CATEGORIES: HabitCategory[] = [
  'Health',
  'Productivity',
  'Mindfulness',
  'Learning',
  'Social',
  'Other'
];

export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  Health: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  Productivity: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  Mindfulness: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  Learning: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  Social: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
  Other: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600',
};

export const DEFAULT_HABITS = [
  {
    id: '1',
    title: 'Drink 2L Water',
    category: 'Health',
    color: 'emerald',
    createdAt: new Date().toISOString(),
    logs: {}
  },
  {
    id: '2',
    title: 'Read 15 mins',
    category: 'Learning',
    color: 'amber',
    createdAt: new Date().toISOString(),
    logs: {}
  }
];