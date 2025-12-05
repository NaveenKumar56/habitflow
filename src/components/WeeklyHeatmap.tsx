
import React from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { Habit, HabitCategory, Language } from '../types';
import { CATEGORY_COLORS, TRANSLATIONS } from '../constants';
import { Check, Trash2, Flame } from 'lucide-react';

interface WeeklyHeatmapProps {
  habits: Habit[];
  currentDate: Date;
  onToggle: (id: string, dateStr: string) => void;
  onDelete?: (id: string) => void;
  lang: Language;
}

const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  return addDays(date, diff);
};

export const WeeklyHeatmap: React.FC<WeeklyHeatmapProps> = ({ habits, currentDate, onToggle, onDelete, lang }) => {
  const weekStart = getStartOfWeek(currentDate); // Monday start
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const today = new Date();
  const t = TRANSLATIONS[lang];

  // Calculate Streak Helper
  const calculateStreak = (habit: Habit) => {
    let streak = 0;
    const checkDate = new Date(); // Start from today
    
    // Check back up to 365 days
    for (let i = 0; i < 365; i++) {
      const d = subDays(checkDate, i);
      const dStr = format(d, 'yyyy-MM-dd');
      
      if (habit.logs[dStr]) {
        streak++;
      } else if (i === 0 && !habit.logs[dStr]) {
        // If today is not done yet, we don't break the streak immediately
        // We only break if yesterday was also missed
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200 overflow-hidden">
      
      {/* Scrollable Container */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[800px] inline-block w-full align-middle">
          
          {/* Header Row */}
          <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-10">
            {/* Sticky Habit Title Header */}
            <div className="p-4 font-medium text-slate-500 dark:text-slate-400 text-sm flex items-center sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 border-r border-slate-100 dark:border-slate-800 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
              {t.habit_title}
            </div>
            
            {/* Days Headers */}
            {weekDays.map((day) => {
              const isToday = isSameDay(day, today);
              return (
                <div key={day.toString()} className={`p-3 text-center flex flex-col items-center justify-center border-l border-slate-100 dark:border-slate-800 ${isToday ? 'bg-orange-50/50 dark:bg-orange-500/10' : ''}`}>
                  <span className={`text-xs font-semibold mb-1 ${isToday ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {format(day, 'EEE')}
                  </span>
                  <div className={`
                    w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
                    ${isToday ? 'bg-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-none' : 'text-slate-700 dark:text-slate-300'}
                  `}>
                    {format(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Habit Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {habits.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                {t.no_habits}
              </div>
            ) : habits.map((habit) => {
              const categoryColor = CATEGORY_COLORS[habit.category as HabitCategory] || CATEGORY_COLORS.Other;
              const streak = calculateStreak(habit);
              
              return (
                <div key={habit.id} className="grid grid-cols-[200px_repeat(7,1fr)] group hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                  
                  {/* Sticky Habit Info Column */}
                  <div className="p-4 flex flex-col justify-center sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-100 dark:border-slate-800 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] group-hover:bg-slate-50 dark:group-hover:bg-slate-900 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate pr-2 mb-1" title={habit.title}>
                          {habit.title}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${categoryColor}`}>
                            {habit.category}
                          </span>
                          
                          {/* Streak Badge */}
                          {streak > 0 && (
                            <div className="flex items-center text-xs font-bold text-orange-500 dark:text-orange-400" title={`${streak} day streak`}>
                              <Flame size={12} className="fill-orange-500 mr-0.5" />
                              {streak}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(habit.id)}
                          className="absolute top-2 right-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-900 p-1 rounded-md"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Day Columns */}
                  {weekDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = !!habit.logs[dateStr];
                    const isFuture = day > today;

                    return (
                      <div key={dateStr} className="p-2 border-l border-slate-100 dark:border-slate-800 flex items-center justify-center">
                        <button
                          onClick={() => !isFuture && onToggle(habit.id, dateStr)}
                          disabled={isFuture}
                          className={`
                            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                            ${isCompleted 
                              ? 'bg-orange-500 text-white shadow-sm scale-100' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 scale-90 hover:scale-95 hover:bg-slate-200 dark:hover:bg-slate-700'}
                            ${isFuture ? 'opacity-30 cursor-not-allowed hover:scale-90 hover:bg-slate-100 dark:hover:bg-slate-800' : 'cursor-pointer'}
                          `}
                        >
                          {isCompleted && <Check size={20} strokeWidth={3} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
