import React from 'react';

const LoadingSpinner = ({ message = 'Loading hotels...' }) => {
  return (
    <div className="loading-spinner-wrapper" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#475569' }}>
        {message}
      </span>
    </div>
  );
};

export default LoadingSpinner;
