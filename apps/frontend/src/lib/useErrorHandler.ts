import { useState } from 'react';

interface ApiError {
  success: false;
  error: string;
}

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleApiError = (err: unknown): string => {
    let message = 'Error desconocido';

    if (err && typeof err === 'object' && 'response' in err) {
      const response = (err as any).response;
      message = response?.data?.error || response?.statusText || message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    setError(message);
    return message;
  };

  const showError = (msg: string) => {
    setError(msg);
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return {
    error,
    success,
    handleApiError,
    showError,
    showSuccess,
    clearError,
    clearSuccess,
  };
}
