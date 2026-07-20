import { useApp } from '../lib/store';
import { TaskItem } from './TaskItem';
import { useState } from 'react';

export function TaskList() {
  const { tasks, doneTasks } = useApp();
  const [showDone, setShowDone] = useState(false);

  // Simple sorting: priorities first (A-Z), then others
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    if (a.priority && b.priority) return a.priority.localeCompare(b.priority);
    return 0;
  });

  return (
    <div className="space-y-4">
      {sortedTasks.length === 0 && (
        <div className="text-center py-10 text-slate-500 text-sm border border-white/5 rounded-xl bg-white/[0.02]">
          No tasks left! You're all caught up.
        </div>
      )}
      
      {sortedTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}

      {doneTasks.length > 0 && (
        <div className="mt-8 border-t border-white/5 pt-6">
          <button
            onClick={() => setShowDone(!showDone)}
            className="text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300 font-bold mb-4 transition-colors flex items-center gap-2"
          >
            <svg className={`w-3 h-3 transition-transform ${showDone ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            {showDone ? 'Hide' : 'Show'} Completed Tasks ({doneTasks.length})
          </button>
          
          {showDone && (
            <div className="space-y-4 opacity-80">
              {doneTasks.slice(0, 50).map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
              {doneTasks.length > 50 && (
                <div className="p-4 text-center text-[10px] uppercase tracking-widest font-mono text-slate-500">
                  Showing last 50 completed tasks.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
