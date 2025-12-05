
import { supabase } from '../lib/supabase';
import { Habit } from '../types';

// --- Cloud Data Management (Supabase) ---

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error loading habits:", error);
      return [];
    }

    // Map database snake_case to app camelCase if needed, 
    // but we structured the table to match mostly.
    // Ensure 'logs' is an object, Supabase returns JSONB as object automatically.
    return (data as any[]).map(h => ({
      id: h.id,
      title: h.title,
      category: h.category,
      color: h.color || 'indigo',
      createdAt: h.created_at,
      logs: h.logs || {}
    }));

  } catch (error) {
    console.error("Failed to load habits", error);
    return [];
  }
};

export const saveHabitToCloud = async (habit: Habit) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { error } = await supabase
    .from('habits')
    .upsert({
      id: habit.id,
      user_id: user.id,
      title: habit.title,
      category: habit.category,
      color: habit.color,
      created_at: habit.createdAt,
      logs: habit.logs
    });

  if (error) console.error("Error saving habit:", error);
};

export const deleteHabitFromCloud = async (id: string) => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id);
  
  if (error) console.error("Error deleting habit:", error);
};

export const syncAllHabits = async (habits: Habit[]) => {
  // For mass updates or imports
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const records = habits.map(h => ({
    id: h.id,
    user_id: user.id,
    title: h.title,
    category: h.category,
    color: h.color,
    created_at: h.createdAt,
    logs: h.logs
  }));

  const { error } = await supabase.from('habits').upsert(records);
  if (error) console.error("Error syncing habits:", error);
};

export const clearAllCloudData = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    // Delete all habits for this user
    await supabase.from('habits').delete().eq('user_id', user.id);
};
