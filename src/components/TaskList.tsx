import { useApp } from '../lib/store';
import { calculateSearchStats } from '../lib/todo';
import { TaskItem } from './TaskItem';
import { Eye } from 'lucide-react';

export function TaskList() {
  const { tasks, doneTasks, searchTerm, showCompleted, setShowCompleted, showArchive, setShowArchive, showFuture, setShowFuture } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const stats = calculateSearchStats(tasks, doneTasks, searchTerm, showCompleted, showArchive, showFuture);

  let allTasks = [...tasks];
  if (showArchive) {
    allTasks = [...allTasks, ...doneTasks];
  }

  const filteredTasks = allTasks.filter(t => {
    if (searchTerm && !t.raw.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    const isArchived = doneTasks.includes(t);
    if (!showCompleted && t.completed && !isArchived) {
      return false;
    }
    if (!showFuture && t.tags['t']) {
      if (t.tags['t'] > todayStr) {
        return false;
      }
    }
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    const dueA = a.tags['due'];
    const dueB = b.tags['due'];

    if (dueA && !dueB) return -1;
    if (!dueA && dueB) return 1;
    if (dueA && dueB && dueA !== dueB) return dueA.localeCompare(dueB);

    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    if (a.priority && b.priority && a.priority !== b.priority) return a.priority.localeCompare(b.priority);

    return 0;
  });

  const handleRevealAll = () => {
    if (stats.hiddenCompleted > 0) setShowCompleted(true);
    if (stats.hiddenFuture > 0) setShowFuture(true);
    if (stats.hiddenArchive > 0) setShowArchive(true);
  };

  const hiddenReasonsList = [
    stats.hiddenCompleted > 0 ? `${stats.hiddenCompleted} completed` : null,
    stats.hiddenFuture > 0 ? `${stats.hiddenFuture} future` : null,
    stats.hiddenArchive > 0 ? `${stats.hiddenArchive} archived` : null,
  ].filter(Boolean).join(', ');

  return (
    <div className="space-y-4">
      {sortedTasks.length === 0 && (
        <div className="text-center py-10 px-4 border border-white/5 rounded-xl bg-white/[0.02]">
          {searchTerm.trim() !== '' ? (
            stats.hiddenTotal > 0 ? (
              <div className="space-y-3 max-w-md mx-auto">
                <p className="text-amber-200 text-sm font-medium">
                  No visible tasks match "{searchTerm.trim()}".
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Found <strong>{stats.hiddenTotal}</strong> matching task{stats.hiddenTotal > 1 ? 's' : ''} hidden by active filters ({hiddenReasonsList}).
                </p>
                <button
                  type="button"
                  onClick={handleRevealAll}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-colors inline-flex items-center gap-2 cursor-pointer mt-1"
                >
                  <Eye className="w-4 h-4" />
                  Reveal {stats.hiddenTotal} Hidden Matching Task{stats.hiddenTotal > 1 ? 's' : ''}
                </button>
              </div>
            ) : (
              <span className="text-slate-400 text-sm">No tasks match "{searchTerm.trim()}".</span>
            )
          ) : (
            <span className="text-slate-500 text-sm">No tasks left! You're all caught up.</span>
          )}
        </div>
      )}
      
      {sortedTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
