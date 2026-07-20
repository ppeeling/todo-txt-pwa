import { useApp } from '../lib/store';

export function TaskInput() {
  const { addTask, searchTerm, setSearchTerm } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addTask(searchTerm.trim());
      setSearchTerm('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-4xl mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="(Priority) YYYY-MM-DD Task @context +project"
        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 pr-20 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
      />
      <div className="absolute right-3 flex gap-2">
        <button
          type="submit"
          disabled={!searchTerm.trim()}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 border border-transparent disabled:border-white/10 rounded text-[10px] text-white disabled:text-slate-500 uppercase font-bold tracking-wider transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}
