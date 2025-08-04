'use client';

import { useState, useCallback } from 'react';
import { NewsFilterOptions } from '../types/types';

interface UseNewsFiltersResult {
  filters: NewsFilterOptions;
  setFilters: (filters: NewsFilterOptions, resetPageCallback?: () => void) => void;
  clearFilters: (resetPageCallback?: () => void) => void;
}

/**
 * ニュースフィルター機能のフック
 */
export const useNewsFilters = (): UseNewsFiltersResult => {
  const [filters, setFiltersState] = useState<NewsFilterOptions>({});

  const setFilters = useCallback((newFilters: NewsFilterOptions, resetPageCallback?: () => void) => {
    setFiltersState(newFilters);
    resetPageCallback?.();
  }, []);

  const clearFilters = useCallback((resetPageCallback?: () => void) => {
    setFiltersState({});
    resetPageCallback?.();
  }, []);

  return {
    filters,
    setFilters,
    clearFilters,
  };
};