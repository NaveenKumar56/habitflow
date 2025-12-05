
import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, BarChart2, User as UserIcon, ChevronLeft, ChevronRight, Moon, Sun, Languages, LogOut, Shield } from 'lucide-react';
import { format, addWeeks, addDays } from 'date-fns';
import { Habit, HabitCategory, User, Language } from './types';
import { loadHabits, saveHabitToCloud, deleteHabitFromCloud, syncAllHabits, clearAllCloudData } from './services/storageService';
import { supabase } from './lib/supabase';
import { TRANSLATIONS } from './constants';
import { AddHabitModal } from './components/AddHabitModal';
import { ChartsView } from './components/ChartsView';
import { WeeklyHeatmap } from './components/WeeklyHeatmap';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { AdminView } from './components/AdminView';

const generateId = () => crypto.randomUUID();

const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  return addDays(date, diff);
};

const getEndOfWeek = (date: Date) => {
  return addDays(getStartOfWeek(date), 6);
};

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // UI State
  const [view, setView] = useState<'dashboard' | 'stats' | 'profile' | 'admin'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Settings State
  const [lang, setLang] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const t = TRANSLATIONS[lang];

  // Apply Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Auth Listener (Supabase)
  useEffect(() => {
    const checkUserRole = (email: string | undefined) => {
        return email === 'naveenzcnk@gmail.com' ? 'admin' : 'user';
    };

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUser({ 
            id: session.user.id, 
            email: session.user.email || '',
            role: checkUserRole(session.user.email)
        });
      }
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCurrentUser({ 
            id: session.user.id, 
            email: session.user.email || '',
            role: checkUserRole(session.user.email)
        });
      } else {
        setCurrentUser(null);
        setHabits([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load Data when User Changes
  useEffect(() => {
    if (currentUser) {
      loadHabits().then(data => setHabits(data));
    }
  }, [currentUser]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleHabit = async (id: string, dateStr: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id !== id) return habit;
      const newLogs = { ...habit.logs };
      if (newLogs[dateStr]) delete newLogs[dateStr];
      else newLogs[dateStr] = true;
      return { ...habit, logs: newLogs };
    });
    
    setHabits(updatedHabits); // Optimistic UI update
    
    const changedHabit = updatedHabits.find(h => h.id === id);
    if (changedHabit) {
        await saveHabitToCloud(changedHabit);
    }
  };

  const addHabit = async (title: string, category: HabitCategory) => {
    const newHabit: Habit = {
      id: generateId(),
      title,
      category,
      color: 'indigo',
      createdAt: new Date().toISOString(),
      logs: {}
    };
    
    setHabits(prev => [...prev, newHabit]);
    await saveHabitToCloud(newHabit);
  };

  const deleteHabit = async (id: string) => {
    if (window.confirm(t.delete_confirm)) {
      setHabits(prev => prev.filter(h => h.id !== id));
      await deleteHabitFromCloud(id);
    }
  };

  const handleImportData = async (importedHabits: Habit[]) => {
    setHabits(importedHabits);
    await syncAllHabits(importedHabits);
    alert('Data imported and synced to cloud!');
  };

  const handleClearData = async () => {
    if (window.confirm(t.delete_confirm)) {
      setHabits([]);
      await clearAllCloudData();
    }
  };

  // --- Auth Guard ---
  if (loading) {
      return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center dark:text-white">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <AuthView 
        lang={lang} 
        setLang={setLang} 
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
    );
  }

  // --- Main App ---
  const weekStart = getStartOfWeek(currentDate);
  const weekEnd = getEndOfWeek(currentDate);
  const weekRangeStr = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 md:h-screen flex md:flex-col sticky top-0 z-30 transition-colors duration-200">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-none">
               <div className="w-3 h-3 bg-white/40 rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t.app_name}</span>
          </div>
          {/* Mobile Theme Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 pb-4 flex md:block overflow-x-auto md:overflow-visible gap-2">
          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all mb-1 ${
              view === 'dashboard' 
                ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 font-medium' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>{t.weekly_focus}</span>
          </button>
          
          <button
            onClick={() => setView('stats')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all mb-1 ${
              view === 'stats' 
                ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 font-medium' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart2 size={20} />
            <span>{t.stats}</span>
          </button>

           <button
            onClick={() => setView('profile')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all mb-1 ${
              view === 'profile' 
                ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 font-medium' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <UserIcon size={20} />
            <span>{t.profile}</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setView('admin')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all mt-4 ${
                view === 'admin' 
                  ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-medium' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Shield size={20} />
              <span>{t.admin}</span>
            </button>
          )}
        </nav>

        <div className="p-4 hidden md:block mt-auto space-y-4">
           {/* Controls */}
           <div className="grid grid-cols-2 gap-2">
             <button 
                onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
                className="flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-100 dark:border-slate-800"
                title="Change Language"
              >
                <Languages size={18} />
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-100 dark:border-slate-800"
                title="Toggle Theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
           </div>
           
           <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                {currentUser.email?.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500">
                <LogOut size={16} />
              </button>
           </div>

           <button
             onClick={() => setIsModalOpen(true)}
             className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg shadow-orange-200 dark:shadow-none flex items-center justify-center space-x-2 transition-transform active:scale-95"
           >
             <Plus size={20} />
             <span>{t.new_habit}</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative scroll-smooth">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {view === 'dashboard' && t.weekly_focus}
              {view === 'stats' && t.performance}
              {view === 'profile' && t.profile}
              {view === 'admin' && t.admin}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {view === 'dashboard' && t.track_desc}
              {view === 'stats' && t.analyze_desc}
              {view === 'profile' && t.manage_desc}
              {view === 'admin' && t.admin_desc}
            </p>
          </div>

          {view === 'dashboard' && (
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-1 self-start md:self-auto transition-colors">
              <button 
                onClick={() => setCurrentDate(prev => addWeeks(prev, -1))}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 min-w-[140px] text-center">
                <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                  {weekRangeStr}
                </span>
              </div>
              <button 
                onClick={() => setCurrentDate(prev => addWeeks(prev, 1))}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </header>

        <div className="max-w-5xl mx-auto pb-20 md:pb-0">
          {view === 'dashboard' && (
             <WeeklyHeatmap 
               habits={habits}
               currentDate={currentDate}
               onToggle={toggleHabit}
               onDelete={deleteHabit}
               lang={lang}
             />
          )}

          {view === 'stats' && (
            <ChartsView habits={habits} darkMode={darkMode} lang={lang} />
          )}

          {view === 'profile' && (
            <ProfileView 
              habits={habits}
              onImport={handleImportData}
              onClearData={handleClearData}
              lang={lang}
            />
          )}

          {view === 'admin' && currentUser.role === 'admin' && (
            <AdminView 
              users={[]} 
              onDeleteUser={() => {}}
              lang={lang}
            />
          )}
        </div>
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-orange-500 text-white rounded-full shadow-xl shadow-orange-300 dark:shadow-none flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <Plus size={28} />
      </button>

      <AddHabitModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
        lang={lang}
      />
    </div>
  );
};

export default App;
