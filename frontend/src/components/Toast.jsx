import { useState, useEffect, memo, useCallback } from 'react';

const ToastItem = memo(({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-red-500',
    warning: 'bg-brand-600',
    info: 'bg-warm-700'
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`toast ${isExiting ? 'toast-exit' : ''} bg-gradient-to-r ${colors[toast.type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] max-w-[400px]`}
    >
      <span className="text-2xl">{icons[toast.type]}</span>
      <div className="flex-1">
        <div className="font-bold text-lg">{toast.title}</div>
        <div className="text-white/90 text-sm">{toast.message}</div>
      </div>
      <button
        onClick={handleClose}
        className="text-white/70 hover:text-white text-xl transition-colors duration-200 hover:scale-110"
      >
        ×
      </button>
    </div>
  );
});

ToastItem.displayName = 'ToastItem';

const ToastContainer = memo(() => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Global toast function
  useEffect(() => {
    window.toast = {
      show: (title, message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, title, message, type, duration }]);
      },
      success: (title, message, duration) => {
        window.toast.show(title, message, 'success', duration);
      },
      error: (title, message, duration) => {
        window.toast.show(title, message, 'error', duration);
      },
      warning: (title, message, duration) => {
        window.toast.show(title, message, 'warning', duration);
      },
      info: (title, message, duration) => {
        window.toast.show(title, message, 'info', duration);
      }
    };

    return () => {
      delete window.toast;
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
});

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;
