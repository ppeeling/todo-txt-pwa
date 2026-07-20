import { useState } from 'react';
import { useApp } from '../lib/store';
import { X, Github, RefreshCw } from 'lucide-react';

export function Settings({ onClose }: { onClose: () => void }) {
  const { config, setConfig, sync, syncing, error } = useApp();
  const [token, setToken] = useState(config?.token || '');
  const [owner, setOwner] = useState(config?.owner || '');
  const [repo, setRepo] = useState(config?.repo || '');
  const [branch, setBranch] = useState(config?.branch || 'main');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig({ token, owner, repo, branch });
  };

  return (
    <div className="flex flex-col p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Sync Settings</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">GitHub PAT (repo access)</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
            placeholder="ghp_..."
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Owner</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
            placeholder="username"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Repository</label>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
            placeholder="todo-repo"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Branch</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
            placeholder="main"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded text-sm transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
          <Github className="w-4 h-4" />
          Save Configuration
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs leading-relaxed">
            {error}
          </div>
        )}
        <button
          onClick={sync}
          disabled={!config || syncing}
          className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-2 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border border-white/10 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
          <span className="text-[11px] font-medium text-slate-300">PWA Ready (Offline Capable)</span>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Changes are stored locally and pushed to your private repo when a network connection is available.
          </p>
        </div>
      </div>
    </div>
  );
}
