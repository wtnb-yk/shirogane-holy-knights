'use client';

import { useState, useCallback } from 'react';

interface UseDiscographySearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string, resetPageCallback?: () => void) => void;
  clearSearch: (resetPageCallback?: () => void) => void;
}

/**
 * アルバム検索機能のフック
 * useNewsSearchパターンに完全準拠
 */
export const useDiscographySearch = (): UseDiscographySearchResult => {
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