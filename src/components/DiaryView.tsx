
import React, { useState, useEffect } from 'react';
import { DiaryEntry, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { format } from 'date-fns';
import { loadDiaryEntries, saveDiaryEntry } from '../services/storageService';
import { Smile, Frown, Meh, AlertCircle, Sparkles, Save, Calendar } from 'lucide-react';
import { CalendarWidget } from './CalendarWidget';

interface DiaryViewProps {
  lang: Language;
}

export const DiaryView: React.FC<DiaryViewProps> = ({ lang }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<DiaryEntry['mood']>('neutral');
  const [isSaving, setIsSaving] = useState(false);
  
  const t = TRANSLATIONS[lang];
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    loadDiaryEntries().then(data => {
      setEntries(data);
      loadEntryForDate(data, selectedDate);
    });
  }, []);

  const loadEntryForDate = (data: DiaryEntry[], date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = data.find(e => e.date === dateStr);
    if (entry) {
      setContent(entry.content);
      setMood(entry.mood);
    } else {
      setContent('');
      setMood('neutral');
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    loadEntryForDate(entries, date);
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSaving(true);

    const existingEntry = entries.find(e => e.date === selectedDateStr);
    const originalEntries = [...entries];
    
    const newEntry: DiaryEntry = {
        id: existingEntry ? existingEntry.id : crypto.randomUUID(),
        date: selectedDateStr,
        content,
        mood,
        createdAt: new Date().toISOString()
    };

    // Optimistic Update
    const updatedEntries = existingEntry 
      ? entries.map(e => e.date === selectedDateStr ? newEntry : e)
      : [newEntry, ...entries];
      
    setEntries(updatedEntries);

    const { error } = await saveDiaryEntry(newEntry);
    
    if (error) {
        // Revert on failure
        setEntries(originalEntries);
        alert('Failed to save diary entry. Please check your connection or database setup.');
    } else {
        alert(t.entry_saved);
    }
    setIsSaving(false);
  };

  const getMoodIcon = (m: string) => {
      switch(m) {
          case 'happy': return <Smile className="text-emerald-500" />;
          case 'sad': return <Frown className="text-blue-500" />;
          case 'stress': return <AlertCircle className="text-red-500" />;
          case 'excited': return <Sparkles className="text-amber-500" />;
          default: return <Meh className="text-slate-500" />;
      }
  };

  const entryDates = entries.map(e => e.date);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        
        <div className="w-full md:w-80 shrink-0 space-y-6">
           <CalendarWidget 
             currentMonth={currentMonth}
             onMonthChange={setCurrentMonth}
             selectedDate={selectedDate}
             onSelectDate={handleDateSelect}
             markers={entryDates}
           />
           
           <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
             <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
               <Calendar size={16} /> Recent Entries
             </h3>
             <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
               {entries.slice(0, 5).map(e => (
                 <button
                   key={e.id}
                   onClick={() => handleDateSelect(new Date(e.date))}
                   className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm flex items-center gap-2"
                 >
                   {getMoodIcon(e.mood)}
                   <div className="truncate">
                     <span className="font-semibold block text-slate-700 dark:text-slate-300">{e.date}</span>
                     <span className="text-slate-500 truncate">{e.content}</span>
                   </div>
                 </button>
               ))}
               {entries.length === 0 && <p className="text-xs text-slate-400">{t.no_entries}</p>}
             </div>
           </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {format(selectedDate, 'EEEE, MMMM do, yyyy')}
              </h2>
              <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-200 dark:shadow-none disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : t.save_entry}
              </button>
            </div>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{t.todays_mood}</label>
                <div className="flex gap-3">
                    {['happy', 'excited', 'neutral', 'sad', 'stress'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMood(m as any)}
                            className={`p-3 rounded-xl border-2 transition-all ${mood === m ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 scale-110' : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 opacity-70 hover:opacity-100'}`}
                            title={m}
                        >
                            {getMoodIcon(m)}
                        </button>
                    ))}
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
                placeholder={t.write_diary}
                className="flex-1 w-full p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none leading-relaxed text-lg"
            />
        </div>
    </div>
  );
};
