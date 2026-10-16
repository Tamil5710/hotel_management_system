import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmDialog = ({
  isOpen = false,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !isProcessing) {
          onCancel();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isProcessing, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={() => {
        if (!isProcessing) onCancel();
      }}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-danger">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="modal-title" id="confirm-dialog-title">
              {title}
            </h3>
          </div>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={15} />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
