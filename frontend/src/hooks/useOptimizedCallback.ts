'use client';

import React, {useCallback, useMemo, useRef} from 'react';

interface UseOptimizedCallbackOptions {
  debounceMs?: number;
  throttleMs?: number;
  maxWait?: number;
}

/**
 * Hook for creating optimized callbacks with debouncing and throttling
 */
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList,
  options: UseOptimizedCallbackOptions = {}
): T => {
  const { debounceMs, throttleMs } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      lastArgsRef.current = args;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Throttling logic
      if (throttleMs && now - lastCallRef.current < throttleMs) {
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, throttleMs - (now - lastCallRef.current));
        return;
      }

      // Debouncing logic
      if (debounceMs) {
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...lastArgsRef.current!);
        }, debounceMs);
        return;
      }

      // Execute immediately if no optimization is specified
      lastCallRef.current = now;
      callback(...args);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  ) as T;
};

/**
 * Hook for debouncing values
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for memoizing expensive computations with cache invalidation
 */
export const useExpensiveComputation = <T, Args extends readonly unknown[]>(
  computeFn: (...args: Args) => T,
  args: Args,
  cacheSize: number = 10
): T => {
  const cacheRef = useRef<Map<string, { value: T; timestamp: number }>>(new Map());
  
  return useMemo(() => {
    const key = JSON.stringify(args);
    const cached = cacheRef.current.get(key);
    
    // Return cached value if it exists and is recent (within 5 minutes)
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.value;
    }
    
    // Compute new value
    const value = computeFn(...args);
    
    // Manage cache size
    if (cacheRef.current.size >= cacheSize) {
      const firstKey = cacheRef.current.keys().next().value;
      if (firstKey !== undefined) {
        cacheRef.current.delete(firstKey);
      }
    }
    
    // Cache the new value
    cacheRef.current.set(key, { value, timestamp: Date.now() });
    
    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args), computeFn, cacheSize]);
};
