import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Habit, Language } from '../types';
import { format } from 'date-fns';
import { TRANSLATIONS } from '../constants';

interface ChartsViewProps {
  habits: Habit[];
  darkMode?: boolean;
  lang: Language;
}

export const ChartsView: React.FC<ChartsViewProps> = ({ habits, darkMode = false, lang }) => {
  const t = TRANSLATIONS[lang];

  // Prepare data for the last 7 days
  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // From 6 days ago to today
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayName = format(d, 'EEE'); // Mon, Tue...

    let completedCount = 0;
    habits.forEach(h => {
      if (h.logs[dateStr]) completedCount++;
    });

    return {
      name: dayName,
      fullDate: dateStr,
      completed: completedCount,
      total: habits.length,
      percentage: habits.length > 0 ? (completedCount / habits.length) * 100 : 0
    };
  });

  const totalCompletions = habits.reduce((acc, h) => {
    return acc + Object.values(h.logs).filter(Boolean).length;
  }, 0);

  const axisColor = darkMode ? '#94a3b8' : '#64748b'; // slate-400 vs slate-500
  const gridColor = darkMode ? '#1e293b' : '#f1f5f9'; // slate-800 vs slate-100
  const tooltipBg = darkMode ? '#0f172a' : '#ffffff';
  const tooltipText = darkMode ? '#f8fafc' : '#0f172a';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-500 rounded-xl p-6 text-white shadow-lg shadow-orange-200 dark:shadow-none">
          <p className="text-orange-100 text-sm font-medium">{t.total_completions}</p>
          <h3 className="text-3xl font-bold mt-1">{totalCompletions}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.active_habits}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{habits.length}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.completion_rate}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
            {Math.round(data[data.length-1].percentage)}%
          </h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-80 transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">{t.weekly_progress}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisColor, fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisColor, fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: darkMode ? '#1e293b' : '#f8fafc' }}
              contentStyle={{ 
                backgroundColor: tooltipBg,
                color: tooltipText,
                borderRadius: '8px', 
                border: darkMode ? '1px solid #1e293b' : 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Bar 
              dataKey="completed" 
              fill="#f97316" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};