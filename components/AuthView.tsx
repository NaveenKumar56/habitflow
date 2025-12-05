import React, { useState } from 'react';
import { User, Language } from '../types';
import { addUser, verifyUser, setSession } from '../services/storageService';
import { TRANSLATIONS } from '../constants';
import { Sun, Moon, Languages, Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: User) => void;
  lang: Language;
  setLang: (l: Language) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, lang, setLang, darkMode, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = verifyUser(username, password);
      if (user) {
        setSession(username, rememberMe);
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    } else {
      if (!username || !password || !displayName) {
        setError('All fields are required');
        return;
      }
      const newUser: User = { username, password, displayName };
      const success = addUser(newUser);
      if (success) {
        setSession(username, rememberMe);
        onLogin(newUser);
      } else {
        setError('Username already exists');
      }
    }
  };

  return (
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      
      {/* Top Controls */}
      <div class="absolute top-4 right-4 flex items-center space-x-2">
        <button 
            onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
            class="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Languages size={18} />
            {lang === 'en' ? '日本語' : 'English'}
        </button>
        <button 
          onClick={toggleTheme}
          class="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="p-8 text-center border-b border-slate-100 dark:border-slate-800">
           <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-none">
              <div class="w-6 h-6 bg-white/20 rounded-full" />
           </div>
           <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
             {t.app_name}
           </h1>
           <p class="text-slate-500 dark:text-slate-400">
             {isLogin ? t.welcome_back : t.get_started}
           </p>
        </div>

        <form onSubmit={handleSubmit} class="p-8 space-y-4">
          {error && (
            <div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.username}</label>
            <input 
              type="text"
              name="username"
              autocomplete="username"
              value={username}
              onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.display_name}</label>
              <input 
                type="text"
                name="displayName"
                autocomplete="name"
                value={displayName}
                onChange={(e) => setDisplayName((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                required
              />
            </div>
          )}

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t.password}</label>
            <div class="relative">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                autocomplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white pr-10"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe((e.target as HTMLInputElement).checked)}
              class="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500 cursor-pointer"
            />
            <label for="remember" class="ml-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">{t.remember_me}</label>
          </div>

          <button 
            type="submit"
            class="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-none transition-all transform active:scale-95"
          >
            {isLogin ? t.sign_in : t.sign_up}
          </button>
        </form>

        <div class="bg-slate-50 dark:bg-slate-950/50 p-4 text-center border-t border-slate-100 dark:border-slate-800">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? t.need_account : t.have_account}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              class="ml-2 text-orange-600 dark:text-orange-400 font-bold hover:underline"
            >
              {isLogin ? t.create_account : t.login}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};