'use client';

import { useState, useCallback } from 'react';
import { AlbumFilterOptions } from '../types/types';

interface UseDiscographyFiltersResult {
  filters: AlbumFilterOptions;
  setFilters: (filters: AlbumFilterOptions, resetPageCallback?: () => void) => void;
  clearFilters: (resetPageCallback?: () => void) => void;
}

/**
 * アルバムフィルター機能のフック
 * useNewsFiltersパターンに完全準拠
 */
export const useDiscographyFilters = (): UseDiscographyFiltersResult => {
  const [filters, setFiltersState] = useState<AlbumFilterOptions>({});

  const setFilters = useCallback((newFilters: AlbumFilterOptions, resetPageCallback?: () => void) => {
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