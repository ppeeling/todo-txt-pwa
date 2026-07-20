import { useApp } from '../lib/store';
import { TaskItem } from './TaskItem';

export function TaskList() {
  const { tasks, doneTasks, searchTerm, showCompleted, showArchive, showFuture } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

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

  return (
    <div className="space-y-4">
      {sortedTasks.length === 0 && (
        <div className="text-center py-10 text-slate-500 text-sm border border-white/5 rounded-xl bg-white/[0.02]">
          {searchTerm ? 'No tasks match your filters.' : "No tasks left! You're all caught up."}
        </div>
      )}
      
      {sortedTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
