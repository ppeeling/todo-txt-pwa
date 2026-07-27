import React from 'react';
import { useApp } from '../lib/store';
import { calculateSearchStats } from '../lib/todo';
import { CheckCircle2, Circle, Eye, EyeOff, Archive, ArchiveX, X, Filter } from 'lucide-react';

export function TaskInput() {
  const { addTask, tasks, doneTasks, searchTerm, setSearchTerm, showCompleted, setShowCompleted, showArchive, setShowArchive, showFuture, setShowFuture } = useApp();

  const stats = calculateSearchStats(tasks, doneTasks, searchTerm, showCompleted, showArchive, showFuture);

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
      <div className="flex flex-wrap items-center justify-between px-1 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${showCompleted ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            {showCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            <span>Completed</span>
            {stats.hiddenCompleted > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-bold border border-amber-500/30">
                +{stats.hiddenCompleted} hidden
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowArchive(!showArchive)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${showArchive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            {showArchive ? <Archive className="w-4 h-4" /> : <ArchiveX className="w-4 h-4" />}
            <span>Archive</span>
            {stats.hiddenArchive > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-bold border border-amber-500/30">
                +{stats.hiddenArchive} hidden
              </span>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setShowFuture(!showFuture)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${showFuture ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            {showFuture ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>Future</span>
            {stats.hiddenFuture > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-bold border border-amber-500/30">
                +{stats.hiddenFuture} hidden
              </span>
            )}
          </button>
        </div>

        {searchTerm.trim() !== '' && (
          <div className="text-xs text-slate-400 font-mono">
            {stats.visibleMatching} visible {stats.hiddenTotal > 0 && `(${stats.hiddenTotal} hidden)`}
          </div>
        )}
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

      {searchTerm.trim() !== '' && stats.hiddenTotal > 0 && (
        <div className="p-2.5 px-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{stats.hiddenTotal}</strong> matching task{stats.hiddenTotal > 1 ? 's' : ''} hidden by active filters:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {stats.hiddenCompleted > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCompleted(true)}
                  className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{stats.hiddenCompleted} completed</span>
                  <span className="underline text-[10px] opacity-80 font-bold">Show</span>
                </button>
              )}
              {stats.hiddenFuture > 0 && (
                <button
                  type="button"
                  onClick={() => setShowFuture(true)}
                  className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{stats.hiddenFuture} future</span>
                  <span className="underline text-[10px] opacity-80 font-bold">Show</span>
                </button>
              )}
              {stats.hiddenArchive > 0 && (
                <button
                  type="button"
                  onClick={() => setShowArchive(true)}
                  className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{stats.hiddenArchive} archived</span>
                  <span className="underline text-[10px] opacity-80 font-bold">Show</span>
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (stats.hiddenCompleted > 0) setShowCompleted(true);
              if (stats.hiddenFuture > 0) setShowFuture(true);
              if (stats.hiddenArchive > 0) setShowArchive(true);
            }}
            className="px-2.5 py-1 bg-amber-500 text-slate-950 hover:bg-amber-400 rounded text-[11px] font-semibold transition-colors shrink-0 cursor-pointer ml-auto"
          >
            Show All Hidden
          </button>
        </div>
      )}
    </div>
  );
}
