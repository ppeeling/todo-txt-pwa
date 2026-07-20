import { useState } from 'react';
import { AppProvider, useApp } from './lib/store';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { Settings } from './components/Settings';
import { ReloadPrompt } from './components/ReloadPrompt';
import { Settings as SettingsIcon } from 'lucide-react';

function TodoApp() {
  const [showSettings, setShowSettings] = useState(false);
  const { lastSync, syncing, sync, tasks, doneTasks } = useApp();

  return (
    <div className="flex flex-col h-screen w-full bg-[#0F1115] text-slate-300 font-sans overflow-hidden">
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#16191E] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">TXT</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-white">Todo.txt Sync</h1>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-mono border border-green-500/20 uppercase tracking-wider">
            Online
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs opacity-60 font-mono hidden sm:flex">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            {lastSync ? `Last sync: ${new Date(lastSync).toLocaleTimeString()}` : 'Never synced'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-1.5 hover:bg-white/10 border rounded text-xs font-medium transition-colors flex items-center gap-2
                ${showSettings ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={sync}
              disabled={syncing}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-colors"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col bg-[#0F1115]">
          <div className="p-6 border-b border-white/5 bg-[#12151A] shrink-0">
            <TaskInput />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <div className="max-w-4xl mx-auto w-full">
              <TaskList />
            </div>
          </div>
        </div>

        {showSettings && (
          <aside className="w-80 border-l border-white/10 bg-[#111418] flex flex-col overflow-y-auto shrink-0 custom-scrollbar absolute right-0 top-0 bottom-0 z-10 md:static">
            <Settings onClose={() => setShowSettings(false)} />
          </aside>
        )}
      </main>

      <footer className="h-8 border-t border-white/10 bg-[#12151A] px-4 flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_#6366f1]"></div> Ready</span>
          <span className="hidden sm:inline">todo.txt tasks: {tasks.length}</span>
          <span className="hidden sm:inline">done.txt tasks: {doneTasks.length}</span>
        </div>
      </footer>
      <ReloadPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <TodoApp />
    </AppProvider>
  );
}
