import { useState } from 'react';
import { Task } from '../lib/todo';
import { useApp } from '../lib/store';
import { Trash2, Edit2, Check, X } from 'lucide-react';

export function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask, updateTask } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.raw);

  const handleSave = () => {
    if (editValue.trim() !== task.raw) {
      updateTask(task.id, editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  const priorityColor = (priority: string | null) => {
    switch (priority) {
      case 'A': return 'text-red-400';
      case 'B': return 'text-orange-400';
      case 'C': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-4 bg-[#16191E] border border-indigo-500/50 rounded-xl group">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-slate-100 border-b border-indigo-500 outline-none px-1 text-sm font-sans"
        />
        <button onClick={handleSave} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors">
          <Check className="w-4 h-4" />
        </button>
        <button onClick={() => setIsEditing(false)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const isHighPriority = task.priority === 'A' || task.priority === 'B';
  const bgClass = isHighPriority ? 'bg-[#16191E] border-white/10' : 'bg-white/[0.02] border-white/5';
  
  return (
    <div className={`group ${bgClass} border p-4 rounded-xl flex items-start gap-4 hover:border-indigo-500/50 transition-all cursor-pointer ${task.completed ? 'opacity-50' : ''}`}>
      <button 
        onClick={() => toggleTask(task.id)}
        className="mt-1 flex-shrink-0 focus:outline-none"
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
          ${task.completed ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700 hover:border-indigo-400'}`}>
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </div>
      </button>

      <div className="flex-1 min-w-0" onClick={() => setIsEditing(true)}>
        {(task.priority || task.creationDate || task.completionDate) && (
          <div className="flex items-center gap-2 mb-1">
            {task.priority && (
              <span className={`font-mono font-bold text-sm ${priorityColor(task.priority)}`}>
                ({task.priority})
              </span>
            )}
            {task.completionDate && (
              <span className="font-mono text-xs text-slate-500">done: {task.completionDate}</span>
            )}
            {task.creationDate && (
              <span className="font-mono text-xs opacity-40">{task.creationDate}</span>
            )}
          </div>
        )}
        
        <p className={`text-sm leading-relaxed ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'} ${task.priority === 'B' ? 'italic opacity-90' : ''}`}>
          {task.description.split(' ').map((word, i) => {
            if (word.startsWith('+')) return <span key={i} className="text-indigo-400 font-mono"> {word}</span>;
            if (word.startsWith('@')) return <span key={i} className="text-emerald-400 font-mono"> {word}</span>;
            if (word.includes(':') && !word.startsWith('http')) return <span key={i} className="text-slate-400 text-xs font-mono"> {word}</span>;
            return ' ' + word;
          })}
        </p>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity flex-shrink-0">
        <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
