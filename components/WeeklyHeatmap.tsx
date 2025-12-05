import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Habit, HabitCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Check, Trash2 } from 'lucide-react';

interface WeeklyHeatmapProps {
  habits: Habit[];
  currentDate: Date;
  onToggle: (id: string, dateStr: string) => void;
  onDelete?: (id: string) => void;
}

const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  return addDays(date, diff);
};

export const WeeklyHeatmap: React.FC<WeeklyHeatmapProps> = ({ habits, currentDate, onToggle, onDelete }) => {
  const weekStart = getStartOfWeek(currentDate); // Monday start
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const today = new Date();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
      {/* Header Row */}
      <div className="grid grid-cols-[minmax(140px,2fr)_repeat(7,1fr)] border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-4 font-medium text-slate-500 dark:text-slate-400 text-sm flex items-center">Habit</div>
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          return (
            <div key={day.toString()} className={`p-3 text-center flex flex-col items-center justify-center border-l border-slate-100 dark:border-slate-800 ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}>
              <span className={`text-xs font-semibold mb-1 ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {format(day, 'EEE')}
              </span>
              <div className={`
                w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
                ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-700 dark:text-slate-300'}
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
            No habits yet. Add one to start tracking!
          </div>
        ) : habits.map((habit) => {
           const categoryColor = CATEGORY_COLORS[habit.category as HabitCategory] || CATEGORY_COLORS.Other;
           
           return (
            <div key={habit.id} className="grid grid-cols-[minmax(140px,2fr)_repeat(7,1fr)] group hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
              {/* Habit Info Column */}
              <div className="p-4 flex flex-col justify-center relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate pr-2">{habit.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${categoryColor}`}>
                        {habit.category}
                      </span>
                    </div>
                  </div>
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(habit.id)}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
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
                          ? 'bg-indigo-500 text-white shadow-sm scale-100' 
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
  );
};