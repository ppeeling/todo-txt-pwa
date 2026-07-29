import React, { useState } from 'react';
import { Task } from '../lib/todo';
import { useApp } from '../lib/store';
import { Trash2, Edit2, Check, X, Plus, Minus, Timer } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  key?: string;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, updateTask, deleteTask } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.raw);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const currentPm = parseInt(task.tags['pm'] || '0', 10) || 0;

  const setPomodoro = (e: React.SyntheticEvent, val: number) => {
    e.stopPropagation();
    let nextPm = val;
    if (nextPm < 0) nextPm = 0;
    
    let newRaw = task.raw;
    if (task.tags['pm'] !== undefined) {
      newRaw = newRaw.replace(new RegExp(`pm:${task.tags['pm']}(?=\\s|$)`), nextPm === 0 ? '' : `pm:${nextPm}`);
      newRaw = newRaw.replace(/\s{2,}/g, ' ').trim();
    } else if (nextPm > 0) {
      newRaw = `${newRaw} pm:${nextPm}`;
    }

    if (newRaw !== task.raw) {
      updateTask(task.id, newRaw);
      setEditValue(newRaw);
    }
  };

  const updatePomodoro = (e: React.MouseEvent, delta: number) => {
    setPomodoro(e, currentPm + delta);
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
    <div className={`group ${bgClass} border p-4 rounded-xl flex flex-col sm:flex-row sm:items-start gap-4 hover:border-indigo-500/50 transition-all cursor-pointer ${task.completed ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0 w-full" onClick={() => setIsEditing(true)}>
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
            if (word.startsWith('pm:')) return null;
            if (word.includes(':') && !word.startsWith('http')) return <span key={i} className="text-slate-400 text-xs font-mono"> {word}</span>;
            return ' ' + word;
          })}
        </p>

        {currentPm > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-xs font-medium flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {currentPm} Pomodoro{currentPm !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      
      <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex gap-2 transition-opacity flex-shrink-0 items-center self-end sm:self-auto w-full sm:w-auto justify-end">
        <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/5" onClick={(e) => e.stopPropagation()}>
          <button onClick={(e) => updatePomodoro(e, -1)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors" disabled={currentPm === 0}>
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="text"
            inputMode="numeric"
            value={currentPm === 0 ? '' : currentPm}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setPomodoro(e, isNaN(val) ? 0 : val);
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-mono w-6 text-center text-slate-300 bg-transparent outline-none"
            placeholder="0"
          />
          <button onClick={(e) => updatePomodoro(e, 1)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
          title={task.completed ? "Mark uncompleted" : "Mark completed"}
          className={`p-1.5 rounded-md transition-colors ${task.completed ? 'text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20' : 'text-slate-400 hover:text-emerald-400 hover:bg-white/5'}`}
        >
          <Check className="w-4 h-4" />
        </button>

        {showDeleteConfirm ? (
          <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 rounded-md p-0.5" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] text-rose-300 font-medium px-1.5">Delete?</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
              title="Confirm deletion (removes line)"
              className="px-1.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors text-xs font-medium flex items-center justify-center"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              title="Cancel"
              className="p-1 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            title="Delete task (removes line)"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
