import { useApp } from '../lib/store';
import { CheckCircle2, Circle, Eye, EyeOff, Archive, ArchiveX, ArrowRightToLine } from 'lucide-react';

export function TaskInput() {
  const { tasks, addTask, searchTerm, setSearchTerm, showCompleted, setShowCompleted, showArchive, setShowArchive, showFuture, setShowFuture, archiveTasks } = useApp();
  
  const hasCompletedTasks = tasks.some(t => t.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addTask(searchTerm.trim());
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
        
        {hasCompletedTasks && (
          <button
            type="button"
            onClick={archiveTasks}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowRightToLine className="w-3 h-3" />
            Archive Completed
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
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
    </div>
  );
}
