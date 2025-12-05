import React, { useState, useEffect } from 'react';
import { UserProfile, DriveConfig } from '../types';
import { Save, LogOut, Cloud, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile | null;
  config: DriveConfig;
  onSaveConfig: (config: DriveConfig) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  isDriveConnected: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, config, onSaveConfig, onSignIn, onSignOut, isDriveConnected 
}) => {
  const [clientId, setClientId] = useState(config.clientId || '');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setClientId(config.clientId);
    setApiKey(config.apiKey);
  }, [config]);

  const handleSave = () => {
    onSaveConfig({ clientId, apiKey });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
               <span className="text-4xl font-bold">{user?.name?.charAt(0) || '?'}</span>
             </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Guest User'}</h2>
        <p className="text-slate-500 dark:text-slate-400">{user?.email || 'Local Account'}</p>
        
        {user && (
          <button 
            onClick={onSignOut}
            className="mt-6 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors inline-flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        )}
      </div>

      {/* Google Drive Connection */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
             <div className={`p-3 rounded-xl ${isDriveConnected ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                <Cloud size={24} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Google Drive Sync</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Backup your habits to the cloud</p>
             </div>
          </div>
          <div>
            {isDriveConnected ? (
              <span className="inline-flex items-center px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-500/20">
                <CheckCircle size={12} className="mr-1" /> CONNECTED
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full">
                OFFLINE
              </span>
            )}
          </div>
        </div>

        {isDriveConnected ? (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-emerald-800 dark:text-emerald-300 text-sm mb-6 border border-emerald-100 dark:border-transparent">
            Your data is currently syncing with <b>habitflow_data.json</b> in your Google Drive.
          </div>
        ) : (
           <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 text-amber-800 dark:text-amber-300 text-sm mb-6 flex items-start border border-amber-100 dark:border-transparent">
             <AlertCircle size={16} className="mt-0.5 mr-2 shrink-0" />
             <p>To sync, you must provide a Google Cloud Client ID below, save it, and then click Connect.</p>
           </div>
        )}

        {/* Configuration Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client ID</label>
            <input 
              type="text" 
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              disabled={!isEditing && config.clientId !== ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-500 transition-colors"
              placeholder="apps.googleusercontent.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">API Key (Optional)</label>
            <input 
              type="text" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={!isEditing && config.apiKey !== ''}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            {isEditing || config.clientId === '' ? (
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 flex items-center transition-colors"
              >
                <Save size={16} className="mr-2" />
                Save Config
              </button>
            ) : (
               <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Edit Config
              </button>
            )}

            {config.clientId && !isDriveConnected && (
              <button 
                onClick={onSignIn}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-200 dark:shadow-none transition-colors"
              >
                Connect to Drive
              </button>
            )}
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-start">
            <HelpCircle size={18} className="text-blue-600 dark:text-blue-400 mt-0.5 mr-2 shrink-0" />
            <div className="text-sm">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Getting "Access Denied" or Error 403?</h4>
              <p className="text-blue-700 dark:text-blue-400 mb-2">
                This usually means your Google Cloud project is in <strong>Testing</strong> mode.
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400 marker:text-blue-400">
                <li>Go to <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noreferrer" className="underline hover:text-blue-900 dark:hover:text-blue-200">OAuth Consent Screen</a> in Google Cloud Console.</li>
                <li>Scroll down to <strong>Test users</strong>.</li>
                <li>Click <strong>+ ADD USERS</strong> and add your email address.</li>
                <li>Also ensure <code>http://localhost:5173</code> is in your "Authorized JavaScript origins".</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};