import { useApp } from '../lib/store';
import { CheckCircle2, Circle, Eye, EyeOff, Archive, ArchiveX, X } from 'lucide-react';

export function TaskInput() {
  const { addTask, searchTerm, setSearchTerm, showCompleted, setShowCompleted, showArchive, setShowArchive, showFuture, setShowFuture } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addTask(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${showCompleted ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            {showCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            <span>Completed</span>
          </button>

          <button
            type="button"
            onClick={() => setShowArchive(!showArchive)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${showArchive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            {showArchive ? <Archive className="w-4 h-4" /> : <ArchiveX className="w-4 h-4" />}
            <span>Archive</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowFuture(!showFuture)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${showFuture ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            {showFuture ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>Future</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="(Priority) YYYY-MM-DD Task @context +project"
          className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-[110px] text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-md transition-colors"
              aria-label="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!searchTerm.trim()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 border border-transparent disabled:border-white/10 rounded text-[10px] text-white disabled:text-slate-500 uppercase font-bold tracking-wider transition-colors"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
