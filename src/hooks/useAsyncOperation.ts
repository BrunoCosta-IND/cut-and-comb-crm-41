
import { useState, useCallback } from 'react';
import { handleError } from '@/lib/errorHandler';

export const useAsyncOperation = <T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  context?: string
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: T): Promise<R | undefined> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation(...args);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      handleError(err, context);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [operation, context]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    isLoading,
    error,
    reset,
  };
};
