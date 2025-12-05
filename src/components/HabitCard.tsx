import React from 'react';
import { Check, Trash2, Flame } from 'lucide-react';
import { Habit, HabitCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  selectedDate: Date;
  onToggle: (id: string, dateStr: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, selectedDate, onToggle, onDelete }) => {
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const isCompleted = !!habit.logs[dateStr];
  
  // Calculate Streak (Simplified: current contiguous streak ending today or yesterday)
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    // Check back up to 365 days
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = format(d, 'yyyy-MM-dd');
      if (habit.logs[dStr]) {
        streak++;
      } else if (i === 0 && !habit.logs[dStr]) {
        // If today is not done, we don't break streak yet, unless yesterday is also missing
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();
  const categoryStyle = CATEGORY_COLORS[habit.category as HabitCategory] || CATEGORY_COLORS.Other;

  return (
    <div class="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
      <div class="flex items-center space-x-4">
        <button
          onClick={() => onToggle(habit.id, dateStr)}
          class={`
            relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200
            ${isCompleted 
              ? 'bg-indigo-600 border-indigo-600 text-white' 
              : 'bg-transparent border-slate-300 text-transparent hover:border-indigo-400'}
          `}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check size={16} strokeWidth={3} class={`transform transition-transform ${isCompleted ? 'scale-100' : 'scale-0'}`} />
        </button>

        <div>
          <h3 class={`font-semibold text-slate-800 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
            {habit.title}
          </h3>
          <div class="flex items-center mt-1 space-x-2">
            <span class={`text-xs px-2 py-0.5 rounded-full border ${categoryStyle}`}>
              {habit.category}
            </span>
            {streak > 0 && (
              <span class="flex items-center text-xs font-medium text-orange-500">
                <Flame size={12} class="mr-1 fill-orange-500" />
                {streak} day streak
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(habit.id)}
        class="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Delete habit"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};