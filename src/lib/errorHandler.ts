
import { toast } from "@/hooks/use-toast";

export class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, context?: string) => {
  console.error(`Error in ${context || 'application'}:`, error);
  
  let message = 'Ocorreu um erro inesperado. Tente novamente.';
  
  if (error instanceof AppError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  
  toast({
    title: "Erro",
    description: message,
    variant: "destructive",
  });
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return undefined;
    }
  };
};
