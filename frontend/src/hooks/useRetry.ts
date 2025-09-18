'use client';

import { useState, useCallback } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { isRetryableError, logError } from '@/utils/errorHandler';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  retryCondition?: (error: unknown) => boolean;
}

interface RetryState {
  isRetrying: boolean;
  attemptCount: number;
  lastError: unknown | null;
}

export const useRetry = (options: RetryOptions = {}) => {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    retryCondition = isRetryableError
  } = options;

  const { isOnline } = useNetworkStatus();
  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    attemptCount: 0,
    lastError: null
  });

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T> => {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setRetryState({
          isRetrying: attempt > 1,
          attemptCount: attempt,
          lastError: null
        });

        const result = await operation();
        
        // Success - reset state
        setRetryState({
          isRetrying: false,
          attemptCount: 0,
          lastError: null
        });
        
        return result;
      } catch (error) {
        lastError = error;
        logError(error, `${context} (attempt ${attempt}/${maxAttempts})`);

        setRetryState({
          isRetrying: false,
          attemptCount: attempt,
          lastError: error
        });

        // Don't retry if offline or if error is not retryable
        if (!isOnline || !retryCondition(error)) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === maxAttempts) {
          throw error;
        }

        // Wait before retry with optional backoff
        const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }, [maxAttempts, delay, backoff, retryCondition, isOnline]);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T> => {
    return executeWithRetry(operation, context);
  }, [executeWithRetry]);

  const reset = useCallback(() => {
    setRetryState({
      isRetrying: false,
      attemptCount: 0,
      lastError: null
    });
  }, []);

  return {
    retry,
    reset,
    ...retryState
  };
};