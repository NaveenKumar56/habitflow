
import React from 'react';
import { AlertTriangle, Copy, Check, Database } from 'lucide-react';

interface DatabaseErrorViewProps {
  onRetry: () => void;
}

export const DatabaseErrorView: React.FC<DatabaseErrorViewProps> = ({ onRetry }) => {
  const [copied, setCopied] = React.useState(false);

  const sqlCode = `-- Create Habits Table
create table habits (
  id uuid primary key,
  user_id uuid references auth.users not null,
  title text not null,
  category text not null,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  logs jsonb default '{}'::jsonb
);

-- Create Diary Entries Table
create table diary_entries (
  id uuid primary key,
  user_id uuid references auth.users not null,
  date text not null,
  content text,
  mood text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Todos Table
create table todos (
  id uuid primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table habits enable row level security;
alter table diary_entries enable row level security;
alter table todos enable row level security;

-- RLS Policies (Allow users to manage ONLY their own data)
create policy "Users can select their own habits" on habits for select using (auth.uid() = user_id);
create policy "Users can insert their own habits" on habits for insert with check (auth.uid() = user_id);
create policy "Users can update their own habits" on habits for update using (auth.uid() = user_id);
create policy "Users can delete their own habits" on habits for delete using (auth.uid() = user_id);

create policy "Users can select their own diary" on diary_entries for select using (auth.uid() = user_id);
create policy "Users can insert their own diary" on diary_entries for insert with check (auth.uid() = user_id);
create policy "Users can update their own diary" on diary_entries for update using (auth.uid() = user_id);
create policy "Users can delete their own diary" on diary_entries for delete using (auth.uid() = user_id);

create policy "Users can select their own todos" on todos for select using (auth.uid() = user_id);
create policy "Users can insert their own todos" on todos for insert with check (auth.uid() = user_id);
create policy "Users can update their own todos" on todos for update using (auth.uid() = user_id);
create policy "Users can delete their own todos" on todos for delete using (auth.uid() = user_id);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-red-200 dark:border-red-900 overflow-hidden">
        
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30 flex items-start gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400 shrink-0">
            <Database size={32} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-red-700 dark:text-red-400">Database Tables Missing</h1>
            <p className="text-red-600 dark:text-red-300 mt-1">
              Your data is disappearing because the necessary tables have not been created in your Supabase project yet.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">1</span>
              Go to Supabase SQL Editor
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm ml-8">
              Open your Supabase project dashboard, click on the <strong>SQL Editor</strong> icon in the left sidebar, and click "New Query".
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">2</span>
              Run this SQL Script
            </h3>
            <div className="relative ml-8 group">
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-xl text-xs md:text-sm font-mono overflow-x-auto max-h-64 whitespace-pre">
                {sqlCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
                title="Copy SQL"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-200 dark:shadow-none"
            >
              I've ran the SQL, Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
