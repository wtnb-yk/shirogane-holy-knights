'use client';

import { useState, useCallback } from 'react';

interface UseNewsSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string, resetPageCallback?: () => void) => void;
  clearSearch: (resetPageCallback?: () => void) => void;
}

/**
 * ニュース検索機能のフック
 */
export const useNewsSearch = (): UseNewsSearchResult => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string, resetPageCallback?: () => void) => {
    setSearchQuery(query);
    resetPageCallback?.();
  }, []);

  const clearSearch = useCallback((resetPageCallback?: () => void) => {
    setSearchQuery('');
    resetPageCallback?.();
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    clearSearch,
  };
};