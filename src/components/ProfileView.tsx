import React, { useRef } from 'react';
import { Habit, Language } from '../types';
import { Download, Upload, Trash2, Database, Smartphone } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface ProfileViewProps {
  habits: Habit[];
  onImport: (habits: Habit[]) => void;
  onClearData: () => void;
  lang: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ habits, onImport, onClearData, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang];

  const handleDownload = () => {
    const dataStr = JSON.stringify(habits, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `yuuhi_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          onImport(parsed);
        } else {
          alert("Invalid file format: Data must be an array of habits.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div class="max-w-2xl mx-auto space-y-8 animate-fade-in">
      
      {/* Intro Card */}
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
        <div class="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-full mx-auto mb-4 flex items-center justify-center text-orange-600 dark:text-orange-400">
          <Database size={32} />
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{t.local_management}</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          {t.local_management_desc}
        </p>
      </div>

      {/* Actions Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Export */}
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center transition-colors">
          <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl mb-4">
            <Download size={24} />
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.backup_data}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            JSON
          </p>
          <button 
            onClick={handleDownload}
            class="mt-auto w-full py-2.5 bg-slate-900 dark:bg-orange-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-orange-700 transition-colors flex items-center justify-center"
          >
            {t.download_backup}
          </button>
        </div>

        {/* Import */}
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center transition-colors">
           <div class="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl mb-4">
            <Upload size={24} />
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.restore_data}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            JSON
          </p>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef}
            onChange={handleFileChange}
            class="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            class="mt-auto w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            {t.select_file}
          </button>
        </div>

      </div>

      {/* Danger Zone */}
      <div class="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-start">
           <div class="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg mr-4 shrink-0">
             <Trash2 size={20} />
           </div>
           <div>
             <h3 class="text-lg font-bold text-red-900 dark:text-red-300">{t.danger_zone}</h3>
             <p class="text-sm text-red-700 dark:text-red-400">
               {t.delete_all_desc}
             </p>
           </div>
        </div>
        <button 
          onClick={onClearData}
          class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
        >
          {t.clear_data}
        </button>
      </div>

      {/* Info Footer */}
      <div class="flex items-center justify-center gap-2 text-slate-400 text-sm">
        <Smartphone size={14} />
        <span>Yuuhi Tracker v2.0</span>
      </div>
    </div>
  );
};