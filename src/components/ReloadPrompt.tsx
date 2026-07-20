import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-[#16191E] border border-indigo-500/30 rounded-xl shadow-2xl flex items-center gap-4 text-sm animate-in slide-in-from-bottom-5">
      <div className="text-slate-300">
        {offlineReady ? (
          <span>App is ready to work offline.</span>
        ) : (
          <span>New update available!</span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload
          </button>
        )}
        <button
          onClick={close}
          className="p-1.5 hover:bg-white/10 rounded text-slate-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
