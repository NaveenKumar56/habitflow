import React from 'react';
import { format, endOfMonth, eachDayOfInterval, getDay, addMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarWidgetProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  markers: string[]; // Array of YYYY-MM-DD strings that have content
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ 
  currentMonth, 
  onMonthChange, 
  selectedDate, 
  onSelectDate, 
  markers 
}) => {
  // Fix: Manual start of month calculation to avoid import error
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Padding for empty start days
  const startDay = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  const emptyDays = Array.from({ length: startDay });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <button 
            onClick={() => onMonthChange(addMonths(currentMonth, -1))}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-slate-400">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
        
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const hasContent = markers.includes(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(day)}
              className={`
                h-9 w-9 rounded-full flex items-center justify-center text-sm relative transition-all
                ${isSelected 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                ${isToday && !isSelected ? 'text-orange-500 font-bold border border-orange-500/30' : ''}
              `}
            >
              {format(day, 'd')}
              {hasContent && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};