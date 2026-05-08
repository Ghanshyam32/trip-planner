'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span>✅</span>
        <span style={{ fontWeight: 500 }}>{message}</span>
      </div>
      <button onClick={onClose} aria-label="Close notification" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1.2rem' }}>
        ×
      </button>
    </div>
  );
}
