'use client';

import { useState } from 'react';
import { FilterOptions } from '../components/filter/ArchiveFilterSection';

interface UseVideoFiltersResult {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions, onPageReset?: () => void) => void;
  clearFilters: (onPageReset?: () => void) => void;
  hasActiveFilters: boolean;
}

/**
 * 動画フィルター機能を管理するhook
 */
export const useVideoFilters = (): UseVideoFiltersResult => {
  const [filters, setFiltersState] = useState<FilterOptions>({
    selectedTags: [],
    startDate: undefined,
    endDate: undefined,
  });

  const setFilters = (newFilters: FilterOptions, onPageReset?: () => void) => {
    setFiltersState(newFilters);
    onPageReset?.();
  };

  const clearFilters = (onPageReset?: () => void) => {
    setFiltersState({
      selectedTags: [],
      startDate: undefined,
      endDate: undefined,
    });
    onPageReset?.();
  };

  const hasActiveFilters = 
    filters.selectedTags.length > 0 || 
    !!filters.startDate || 
    !!filters.endDate;

  return {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
  };
};
