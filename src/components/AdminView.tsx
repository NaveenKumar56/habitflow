import React from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Shield, ExternalLink } from 'lucide-react';

interface AdminViewProps {
  users: User[];
  onDeleteUser: (username: string) => void;
  lang: Language;
}

export const AdminView: React.FC<AdminViewProps> = ({ users, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div class="space-y-6 animate-fade-in">
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-purple-200 dark:shadow-none">
        <div class="flex items-center gap-4 mb-4">
           <div class="bg-white/20 p-3 rounded-xl">
             <Shield size={32} class="text-white" />
           </div>
           <div>
             <h2 class="text-2xl font-bold">{t.admin}</h2>
             <p class="text-purple-100">{t.admin_desc}</p>
           </div>
        </div>
        
        <div class="bg-white/10 rounded-xl p-4 mt-6">
           <h3 class="font-semibold mb-2 flex items-center gap-2">
             User Management
           </h3>
           <p class="text-sm opacity-90 leading-relaxed">
             This panel is restricted to <strong>naveenzcnk@gmail.com</strong>.
             To manage other users, please access the Supabase Dashboard.
           </p>
           <a 
             href="https://supabase.com/dashboard/project/_/auth/users" 
             target="_blank" 
             rel="noopener noreferrer"
             class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-purple-700 rounded-lg font-bold text-sm hover:bg-purple-50 transition-colors"
           >
             Go to Supabase Dashboard <ExternalLink size={14} />
           </a>
        </div>
      </div>
    </div>
  );
};