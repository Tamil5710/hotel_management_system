import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useHotels } from '../hooks/useHotels';

const Toast = () => {
  const { toast, hideToast } = useHotels();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, toast.message, hideToast]);

  if (!toast.visible) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertCircle size={20} color="#f93154" />;
      case 'info':
        return <Info size={20} color="#000000" />;
      case 'success':
      default:
        return <CheckCircle2 size={20} color="#00b74a" />;
    }
  };

  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      <div className={`toast toast-${toast.type || 'success'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          {renderIcon()}
          <span className="toast-message">{toast.message}</span>
        </div>
        <button
          type="button"
          className="toast-close-btn"
          onClick={hideToast}
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
