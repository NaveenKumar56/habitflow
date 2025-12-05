import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Sun, Moon, Languages, Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  lang: Language;
  setLang: (l: Language) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ lang, setLang, darkMode, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Account created! Check your email or log in.");
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button 
            onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Languages size={18} />
            {lang === 'en' ? '日本語' : 'English'}
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800">
           <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-none">
              <div className="w-6 h-6 bg-white/20 rounded-full" />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
             {t.app_name}
           </h1>
           <p className="text-slate-500 dark:text-slate-400">
             {isLogin ? t.welcome_back : t.get_started}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}
          {message && (
             <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg text-center">
             {message}
           </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <input 
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.password}</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white pr-10"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? t.sign_in : t.sign_up)}
          </button>
        </form>

        <div className="bg-slate-50 dark:bg-slate-950/50 p-4 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? t.need_account : t.have_account}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 text-orange-600 dark:text-orange-400 font-bold hover:underline"
            >
              {isLogin ? t.create_account : t.login}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};