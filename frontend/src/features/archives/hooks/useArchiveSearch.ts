'use client';

import { useState } from 'react';

interface UseArchiveSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string, onPageReset?: () => void) => void;
  clearSearch: (onPageReset?: () => void) => void;
}

/**
 * アーカイブ検索機能を管理するhook
 */
export const useArchiveSearch = (): UseArchiveSearchResult => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string, onPageReset?: () => void) => {
    setSearchQuery(query);
    onPageReset?.();
  };

  const clearSearch = (onPageReset?: () => void) => {
    setSearchQuery('');
    onPageReset?.();
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    clearSearch,
  };
};