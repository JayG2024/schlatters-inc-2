import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

interface UseAsyncOperationOptions<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export const useAsyncOperation = <T = any>(
  operation: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions<T> = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { showToast } = useToast();

  const {
    onSuccess,
    onError,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
    showSuccessToast = true,
    showErrorToast = true
  } = options;

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation(...args);
      setData(result);
      
      if (showSuccessToast) {
        showToast({
          type: 'success',
          title: 'Success',
          message: successMessage
        });
      }
      
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      if (showErrorToast) {
        showToast({
          type: 'error',
          title: 'Error',
          message: error.message || errorMessage
        });
      }
      
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [operation, onSuccess, onError, successMessage, errorMessage, showSuccessToast, showErrorToast, showToast]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset
  };
};