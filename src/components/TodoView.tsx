
import React, { useState, useEffect } from 'react';
import { Todo, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { loadTodos, saveTodo, deleteTodo } from '../services/storageService';
import { Plus, CheckCircle, Circle, Trash2, ListTodo, AlertTriangle } from 'lucide-react';

interface TodoViewProps {
  lang: Language;
}

export const TodoView: React.FC<TodoViewProps> = ({ lang }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    loadTodos().then(setTodos);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError(null);

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newTitle,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const prevTodos = [...todos];
    setTodos([newTodo, ...todos]);
    setNewTitle('');

    const { error: saveError } = await saveTodo(newTodo);
    if (saveError) {
        setTodos(prevTodos);
        setError('Failed to save task. Database table might be missing.');
    }
  };

  const handleToggle = async (id: string) => {
    const originalTodos = [...todos];
    const updated = todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    
    const target = updated.find(t => t.id === id);
    if (target) {
        const { error: saveError } = await saveTodo(target);
        if (saveError) {
            setTodos(originalTodos);
            setError('Sync error. Changes reverted.');
        }
    }
  };

  const handleDelete = async (id: string) => {
    const originalTodos = [...todos];
    setTodos(todos.filter(t => t.id !== id));
    
    const { error: deleteError } = await deleteTodo(id);
    if (deleteError) {
         setTodos(originalTodos);
         setError('Failed to delete task.');
    }
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
             <ListTodo size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.tasks}</h2>
        </div>

        {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-xl flex items-center gap-2 text-sm font-medium animate-pulse">
                <AlertTriangle size={18} />
                {error}
            </div>
        )}

        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle((e.target as HTMLInputElement).value)}
            placeholder={t.add_task}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
          />
          <button 
            type="submit"
            disabled={!newTitle.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={24} />
          </button>
        </form>
      </div>

      <div className="grid gap-6">
         <div className="space-y-2">
           {activeTodos.map(todo => (
             <div key={todo.id} className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
               <button onClick={() => handleToggle(todo.id)} className="text-slate-400 hover:text-blue-600 transition-colors">
                 <Circle size={24} />
               </button>
               <span className="flex-1 font-medium text-slate-800 dark:text-slate-200">{todo.title}</span>
               <button onClick={() => handleDelete(todo.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                 <Trash2 size={20} />
               </button>
             </div>
           ))}
           {activeTodos.length === 0 && todos.length === 0 && (
             <p className="text-center text-slate-400 py-8">{t.no_tasks}</p>
           )}
         </div>

         {completedTodos.length > 0 && (
           <div className="space-y-2 opacity-60">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-2">Completed</h3>
             {completedTodos.map(todo => (
               <div key={todo.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                 <button onClick={() => handleToggle(todo.id)} className="text-emerald-500">
                   <CheckCircle size={24} />
                 </button>
                 <span className="flex-1 font-medium text-slate-500 line-through">{todo.title}</span>
                 <button onClick={() => handleDelete(todo.id)} className="text-slate-300 hover:text-red-500">
                   <Trash2 size={20} />
                 </button>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
};
