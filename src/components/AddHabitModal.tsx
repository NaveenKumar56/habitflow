import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HabitCategory, Language } from '../types';
import { CATEGORIES, TRANSLATIONS } from '../constants';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, category: HabitCategory) => void;
  lang: Language;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd, lang }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, category);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setTitle('');
    setCategory('Health');
    onClose();
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 class="text-lg font-bold text-slate-800 dark:text-white">{t.new_habit}</h2>
          <button onClick={resetAndClose} class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div class="p-6">
          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.habit_title}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                placeholder={t.habit_placeholder}
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                autofocus
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.category}</label>
              <select
                value={category}
                onChange={(e) => setCategory((e.target as HTMLSelectElement).value as HabitCategory)}
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!title.trim()}
              class="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {t.create}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};