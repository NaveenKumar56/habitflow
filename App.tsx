import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, BarChart2, Settings, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { format, addWeeks, addDays } from 'date-fns';
import { Habit, HabitCategory } from './types';
import { loadHabits, saveHabits as saveLocal } from './services/storageService';
import { AddHabitModal } from './components/AddHabitModal';
import { ChartsView } from './components/ChartsView';
import { WeeklyHeatmap } from './components/WeeklyHeatmap';
import { ProfileView } from './components/ProfileView';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper functions to replace missing date-fns exports
const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  return addDays(date, diff);
};

const getEndOfWeek = (date: Date) => {
  return addDays(getStartOfWeek(date), 6);
};

const App: React.FC = () => {
  // Data State
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // UI State
  const [view, setView] = useState<'dashboard' | 'stats' | 'profile'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

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

  // Initial Load (Local)
  useEffect(() => {
    const loaded = loadHabits();
    setHabits(loaded);
  }, []);

  // Data Operations
  const saveAll = (newHabits: Habit[]) => {
    setHabits(newHabits);
    saveLocal(newHabits);
  };

  const toggleHabit = (id: string, dateStr: string) => {
    const newHabits = habits.map(habit => {
      if (habit.id !== id) return habit;
      const newLogs = { ...habit.logs };
      if (newLogs[dateStr]) delete newLogs[dateStr];
      else newLogs[dateStr] = true;
      return { ...habit, logs: newLogs };
    });
    saveAll(newHabits);
  };

  const addHabit = (title: string, category: HabitCategory) => {
    const newHabit: Habit = {
      id: generateId(),
      title,
      category,
      color: 'indigo',
      createdAt: new Date().toISOString(),
      logs: {}
    };
    saveAll([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      saveAll(habits.filter(h => h.id !== id));
    }
  };

  const handleImportData = (importedHabits: Habit[]) => {
    saveAll(importedHabits);
    alert('Data imported successfully!');
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure? This will delete all your habits permanently.")) {
      saveAll([]);
    }
  };

  // Render
  const weekStart = getStartOfWeek(currentDate);
  const weekEnd = getEndOfWeek(currentDate);
  const weekRangeStr = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 md:h-screen flex md:flex-col sticky top-0 z-30 transition-colors duration-200">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 dark:shadow-none shadow-lg">
               <div className="w-3 h-3 bg-white rounded-full opacity-60" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">HabitFlow</span>
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
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Weekly Heatmap</span>
          </button>
          
          <button
            onClick={() => setView('stats')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all mb-1 ${
              view === 'stats' 
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart2 size={20} />
            <span>Statistics</span>
          </button>

           <button
            onClick={() => setView('profile')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
              view === 'profile' 
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 hidden md:block mt-auto space-y-4">
           {/* Desktop Theme Toggle */}
           <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
           </div>

           <button
             onClick={() => setIsModalOpen(true)}
             className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center space-x-2 transition-transform active:scale-95"
           >
             <Plus size={20} />
             <span>New Habit</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative scroll-smooth">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {view === 'dashboard' && 'Weekly Focus'}
              {view === 'stats' && 'Performance'}
              {view === 'profile' && 'Data & Settings'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {view === 'dashboard' && 'Track your consistency day by day.'}
              {view === 'stats' && 'Analyze your long-term progress.'}
              {view === 'profile' && 'Manage your local data.'}
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
             />
          )}

          {view === 'stats' && (
            <ChartsView habits={habits} darkMode={darkMode} />
          )}

          {view === 'profile' && (
            <ProfileView 
              habits={habits}
              onImport={handleImportData}
              onClearData={handleClearData}
            />
          )}
        </div>
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-300 dark:shadow-none flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <Plus size={28} />
      </button>

      <AddHabitModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
};

export default App;