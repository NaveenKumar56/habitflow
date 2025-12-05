import React, { useRef } from 'react';
import { Habit } from '../types';
import { Download, Upload, Trash2, Database, Smartphone } from 'lucide-react';

interface ProfileViewProps {
  habits: Habit[];
  onImport: (habits: Habit[]) => void;
  onClearData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ habits, onImport, onClearData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const dataStr = JSON.stringify(habits, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `habitflow_backup_${new Date().toISOString().split('T')[0]}.json`;
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
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      
      {/* Intro Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full mx-auto mb-4 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Database size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Local Data Management</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Your habit data is stored securely in your browser's local storage. You can backup your data to a file or restore it from a backup.
        </p>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Export */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center transition-colors">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl mb-4">
            <Download size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Backup Data</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Download your {habits.length} habits as a JSON file.
          </p>
          <button 
            onClick={handleDownload}
            className="mt-auto w-full py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            Download Backup
          </button>
        </div>

        {/* Import */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center transition-colors">
           <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl mb-4">
            <Upload size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Restore Data</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Overwrite current habits with a backup file.
          </p>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-auto w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            Select File
          </button>
        </div>

      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start">
           <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg mr-4 shrink-0">
             <Trash2 size={20} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-red-900 dark:text-red-300">Clear All Data</h3>
             <p className="text-sm text-red-700 dark:text-red-400">
               Permanently delete all habits and history from this browser.
             </p>
           </div>
        </div>
        <button 
          onClick={onClearData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
        >
          Reset App
        </button>
      </div>

      {/* Info Footer */}
      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
        <Smartphone size={14} />
        <span>HabitFlow v1.2 (Local)</span>
      </div>
    </div>
  );
};