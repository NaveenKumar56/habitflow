
import React, { useState, useEffect } from 'react';
import { DiaryEntry, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { format } from 'date-fns';
import { loadDiaryEntries, saveDiaryEntry } from '../services/storageService';
import { Smile, Frown, Meh, AlertCircle, Sparkles, Save } from 'lucide-react';

interface DiaryViewProps {
  lang: Language;
}

export const DiaryView: React.FC<DiaryViewProps> = ({ lang }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<DiaryEntry['mood']>('neutral');
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    loadDiaryEntries().then(setEntries);
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const existingEntry = entries.find(e => e.date === todayStr);
    
    const newEntry: DiaryEntry = {
        id: existingEntry ? existingEntry.id : crypto.randomUUID(),
        date: todayStr,
        content,
        mood,
        createdAt: new Date().toISOString()
    };

    // Optimistic Update
    setEntries(prev => {
        const filtered = prev.filter(e => e.date !== todayStr);
        return [newEntry, ...filtered];
    });

    await saveDiaryEntry(newEntry);
    alert(t.save_entry + '!');
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

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{format(new Date(), 'EEEE, MMMM do')}</h2>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.todays_mood}</label>
                <div className="flex gap-2">
                    {['happy', 'excited', 'neutral', 'sad', 'stress'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMood(m as any)}
                            className={`p-3 rounded-xl border-2 transition-all ${mood === m ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'}`}
                        >
                            {getMoodIcon(m)}
                        </button>
                    ))}
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.write_diary}
                className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            />

            <div className="mt-4 flex justify-end">
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
                >
                    <Save size={18} />
                    {t.save_entry}
                </button>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">History</h3>
            {entries.length === 0 && <p className="text-slate-500 dark:text-slate-400">{t.no_entries}</p>}
            {entries.map(entry => (
                <div key={entry.id} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4">
                    <div className="shrink-0 pt-1">
                        {getMoodIcon(entry.mood)}
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">{entry.date}</div>
                        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{entry.content}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
