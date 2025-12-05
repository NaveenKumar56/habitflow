
import { supabase } from '../lib/supabase';
import { Habit, DiaryEntry, Todo } from '../types';

// --- Database Health Check ---

export const checkDatabaseConnection = async () => {
  // Try to access the habits table. If it doesn't exist, Supabase returns a specific error (404/PGRST205)
  const { error } = await supabase.from('habits').select('id').limit(1);
  return error;
};

// --- Cloud Data Management (Supabase) ---

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error loading habits:", error);
      throw error;
    }

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: "No user logged in" } };

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
  return { error };
};

export const deleteHabitFromCloud = async (id: string) => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id);
  
  if (error) console.error("Error deleting habit:", error);
  return { error };
};

export const syncAllHabits = async (habits: Habit[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: "No user logged in" } };

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
  return { error };
};

export const clearAllCloudData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: "No user logged in" } };
    
    // Execute deletions in parallel
    const results = await Promise.all([
      supabase.from('habits').delete().eq('user_id', user.id),
      supabase.from('diary_entries').delete().eq('user_id', user.id),
      supabase.from('todos').delete().eq('user_id', user.id)
    ]);

    const error = results.find(r => r.error)?.error;
    return { error };
};

// --- Diary Management ---

export const loadDiaryEntries = async (): Promise<DiaryEntry[]> => {
    try {
        const { data, error } = await supabase
            .from('diary_entries')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        return (data as any[]).map(d => ({
            id: d.id,
            date: d.date,
            content: d.content,
            mood: d.mood,
            createdAt: d.created_at
        }));
    } catch (error) {
        console.error("Failed load diary", error);
        return [];
    }
}

export const saveDiaryEntry = async (entry: DiaryEntry) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: "No user logged in" } };

    const { error } = await supabase
        .from('diary_entries')
        .upsert({
            id: entry.id,
            user_id: user.id,
            date: entry.date,
            content: entry.content,
            mood: entry.mood,
            created_at: entry.createdAt
        });

    if (error) console.error("Error saving diary:", error);
    return { error };
}

// --- Todo Management ---

export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading todos:", error);
      return [];
    }

    return (data as any[]).map(t => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      createdAt: t.created_at
    }));
  } catch (error) {
    console.error("Failed to load todos", error);
    return [];
  }
};

export const saveTodo = async (todo: Todo) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: "No user logged in" } };

  const { error } = await supabase
    .from('todos')
    .upsert({
      id: todo.id,
      user_id: user.id,
      title: todo.title,
      completed: todo.completed,
      created_at: todo.createdAt
    });

  if (error) {
      console.error("Error saving todo:", error);
      return { error };
  }
  return { error: null };
};

export const deleteTodo = async (id: string) => {
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) console.error("Error deleting todo:", error);
  return { error };
};
