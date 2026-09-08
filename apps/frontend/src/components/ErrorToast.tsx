'use client';

import { useEffect, useState } from 'react';

interface ErrorToastProps {
  message: string;
  onClose?: () => void;
  duration?: number;
}

export function ErrorToast({ message, onClose, duration = 5000 }: ErrorToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start">
        <div className="text-red-600 font-bold mr-3">⚠️</div>
        <div className="flex-1">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-red-600 hover:text-red-800 font-bold ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function SuccessToast({ message, onClose, duration = 3000 }: Omit<ErrorToastProps, 'type'>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start">
        <div className="text-green-600 font-bold mr-3">✅</div>
        <div className="flex-1">
          <p className="font-semibold">Éxito</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-green-600 hover:text-green-800 font-bold ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
