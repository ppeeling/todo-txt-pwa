import { useState } from 'react';
import { useApp } from '../lib/store';

export function TaskInput() {
  const { addTask } = useApp();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      addTask(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-4xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="(Priority) YYYY-MM-DD Task @context +project"
        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
      />
      <div className="absolute right-3 flex gap-2">
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] text-slate-300 font-mono disabled:opacity-50 transition-colors"
        >
          Enter
        </button>
      </div>
    </form>
  );
}
