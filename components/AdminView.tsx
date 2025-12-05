import React from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Trash2, Shield, User as UserIcon, Users } from 'lucide-react';

interface AdminViewProps {
  users: User[];
  onDeleteUser: (username: string) => void;
  lang: Language;
}

export const AdminView: React.FC<AdminViewProps> = ({ users, onDeleteUser, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-orange-500 rounded-xl p-6 text-white shadow-lg shadow-orange-200 dark:shadow-none flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">{t.total_users}</p>
            <h3 className="text-3xl font-bold mt-1">{users.length}</h3>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Users size={24} className="text-white" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
           <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-full text-blue-600 dark:text-blue-400">
             <Shield size={24} />
           </div>
           <div>
             <h3 className="font-bold text-slate-900 dark:text-white">Admin Dashboard</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">{t.admin_desc}</p>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t.users_list}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">{t.username}</th>
                <th className="px-6 py-4 font-semibold">{t.display_name}</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.username} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 text-slate-500 dark:text-slate-400">
                        <UserIcon size={14} />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.displayName}</td>
                  <td className="px-6 py-4">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => onDeleteUser(u.username)}
                        className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title={t.delete_user}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};