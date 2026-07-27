import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import localforage from 'localforage';
import { SyncConfig, GitHubSync } from './github';
import { Task, parseTodo, stringifyTask, mergeTasks } from './todo';

interface AppState {
  tasks: Task[];
  doneTasks: Task[];
  config: SyncConfig | null;
  lastSync: Date | null;
  syncing: boolean;
  error: string | null;
  searchTerm: string;
  showCompleted: boolean;
  showArchive: boolean;
  showFuture: boolean;
}

interface AppContextType extends AppState {
  setConfig: (config: SyncConfig) => void;
  sync: () => Promise<void>;
  addTask: (line: string) => void;
  updateTask: (id: string, line: string) => void;
  toggleTask: (id: string) => void;
  archiveTasks: () => void;
  setSearchTerm: (term: string) => void;
  setShowCompleted: (show: boolean) => void;
  setShowArchive: (show: boolean) => void;
  setShowFuture: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [config, setConfigState] = useState<SyncConfig | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompletedState] = useState(false);
  const [showArchive, setShowArchiveState] = useState(false);
  const [showFuture, setShowFutureState] = useState(true);

  const configRef = useRef(config);
  const syncingRef = useRef(syncing);
  const dirtyRef = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    configRef.current = config;
    syncingRef.current = syncing;
  }, [config, syncing]);

  useEffect(() => {
    async function loadData() {
      const storedConfig = await localforage.getItem<SyncConfig>('github_config');
      if (storedConfig) setConfigState(storedConfig);

      const storedTasks = await localforage.getItem<string[]>('todo_txt');
      if (storedTasks) setTasks(storedTasks.map(parseTodo));

      const storedDone = await localforage.getItem<string[]>('done_txt');
      if (storedDone) setDoneTasks(storedDone.map(parseTodo));

      const storedLastSync = await localforage.getItem<Date>('last_sync');
      if (storedLastSync) setLastSync(storedLastSync);
      
      const storedShowCompleted = await localforage.getItem<boolean>('settings_showCompleted');
      if (storedShowCompleted !== null) setShowCompletedState(storedShowCompleted);
      
      const storedShowArchive = await localforage.getItem<boolean>('settings_showArchive');
      if (storedShowArchive !== null) setShowArchiveState(storedShowArchive);
      
      const storedShowFuture = await localforage.getItem<boolean>('settings_showFuture');
      if (storedShowFuture !== null) setShowFutureState(storedShowFuture);

      setInitialized(true);
      
      // Auto-sync if configured
      if (storedConfig) {
        syncWithConfig(storedConfig).catch(console.error);
      }
    }
    loadData();
  }, []);

  const syncWithConfig = async (currentConfig: SyncConfig) => {
    if (syncingRef.current) {
      dirtyRef.current = true;
      return;
    }
    
    setSyncing(true);
    syncingRef.current = true;
    setError(null);
    
    try {
      const github = new GitHubSync();
      github.setConfig(currentConfig);

      // Fetch remote states
      const remoteTodo = await github.fetchFile('todo.txt');
      const remoteDone = await github.fetchFile('done.txt');

      // Load last synced states
      const baseTodo = (await localforage.getItem<string[]>('todo_txt_base')) || [];
      const baseDone = (await localforage.getItem<string[]>('done_txt_base')) || [];

      // Current local states at start of sync
      const currentLocalTodoStr = (await localforage.getItem<string[]>('todo_txt')) || [];
      const currentLocalDoneStr = (await localforage.getItem<string[]>('done_txt')) || [];

      // Merge remote into current local state
      const mergedTodoStr = mergeTasks(baseTodo, currentLocalTodoStr, remoteTodo.content);
      const mergedDoneStr = mergeTasks(baseDone, currentLocalDoneStr, remoteDone.content);

      // Save to github if changed
      let newTodoSha = remoteTodo.sha;
      if (mergedTodoStr.join('\n') !== remoteTodo.content.join('\n')) {
        newTodoSha = await github.saveFile('todo.txt', mergedTodoStr, remoteTodo.sha);
      }

      let newDoneSha = remoteDone.sha;
      if (mergedDoneStr.join('\n') !== remoteDone.content.join('\n')) {
        newDoneSha = await github.saveFile('done.txt', mergedDoneStr, remoteDone.sha);
      }

      // Update local base with what we just pushed
      await localforage.setItem('todo_txt_base', mergedTodoStr);
      await localforage.setItem('done_txt_base', mergedDoneStr);
      
      const newSyncDate = new Date();
      await localforage.setItem('last_sync', newSyncDate);
      setLastSync(newSyncDate);

      // Resolve any local edits that happened during the network requests
      const latestLocalTodoStr = (await localforage.getItem<string[]>('todo_txt')) || [];
      const latestLocalDoneStr = (await localforage.getItem<string[]>('done_txt')) || [];

      const finalLocalTodo = mergeTasks(currentLocalTodoStr, latestLocalTodoStr, mergedTodoStr);
      const finalLocalDone = mergeTasks(currentLocalDoneStr, latestLocalDoneStr, mergedDoneStr);

      setTasks(finalLocalTodo.map(parseTodo));
      setDoneTasks(finalLocalDone.map(parseTodo));
      await localforage.setItem('todo_txt', finalLocalTodo);
      await localforage.setItem('done_txt', finalLocalDone);
    } catch (e: any) {
      setError(e.message || "Failed to sync");
      console.error(e);
    } finally {
      setSyncing(false);
      syncingRef.current = false;
      if (dirtyRef.current) {
        dirtyRef.current = false;
        syncWithConfig(currentConfig).catch(console.error);
      }
    }
  };

  const sync = () => {
    if (!config) return Promise.resolve();
    return syncWithConfig(config);
  };

  const saveTasks = async (newTasks: Task[], newDoneTasks: Task[]) => {
    setTasks(newTasks);
    setDoneTasks(newDoneTasks);
    await localforage.setItem('todo_txt', newTasks.map(stringifyTask));
    await localforage.setItem('done_txt', newDoneTasks.map(stringifyTask));
    
    // Auto-sync if configured and online
    if (configRef.current && navigator.onLine) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        if (configRef.current) {
          syncWithConfig(configRef.current).catch(console.error);
        }
      }, 2000);
    }
  };

  const setConfig = async (newConfig: SyncConfig) => {
    setConfigState(newConfig);
    await localforage.setItem('github_config', newConfig);
  };

  const setShowCompleted = async (show: boolean) => {
    setShowCompletedState(show);
    await localforage.setItem('settings_showCompleted', show);
  };
  
  const setShowArchive = async (show: boolean) => {
    setShowArchiveState(show);
    await localforage.setItem('settings_showArchive', show);
  };
  
  const setShowFuture = async (show: boolean) => {
    setShowFutureState(show);
    await localforage.setItem('settings_showFuture', show);
  };

  const addTask = (line: string) => {
    let task = parseTodo(line);
    if (!task.creationDate) {
      task.creationDate = new Date().toISOString().split('T')[0];
      task.raw = stringifyTask(task);
    }
    saveTasks([...tasks, task], doneTasks);
  };

  const updateTask = (id: string, line: string) => {
    saveTasks(
      tasks.map(t => t.id === id ? parseTodo(line) : t),
      doneTasks
    );
  };

  const toggleTask = (id: string) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex >= 0) {
      const task = tasks[taskIndex];
      let newTaskRaw = task.raw;
      if (task.completed) {
        // Un-complete
        newTaskRaw = task.raw.replace(/^x \d{4}-\d{2}-\d{2} /, '');
      } else {
        // Complete
        newTaskRaw = `x ${new Date().toISOString().split('T')[0]} ${task.raw}`;
      }
      const newTask = parseTodo(newTaskRaw);
      
      saveTasks(
        tasks.map(t => t.id === id ? newTask : t),
        doneTasks
      );
    }
  };

  const archiveTasks = () => {
    const completedTasks = tasks.filter(t => t.completed);
    const remainingTasks = tasks.filter(t => !t.completed);
    if (completedTasks.length > 0) {
      saveTasks(
        remainingTasks,
        [...completedTasks, ...doneTasks]
      );
    }
  };

  if (!initialized) return null;

  return (
    <AppContext.Provider value={{ tasks, doneTasks, config, lastSync, syncing, error, searchTerm, showCompleted, showArchive, showFuture, setConfig, sync, addTask, updateTask, toggleTask, archiveTasks, setSearchTerm, setShowCompleted, setShowArchive, setShowFuture }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
