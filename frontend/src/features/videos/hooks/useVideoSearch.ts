'use client';

import { useState } from 'react';

interface UseVideoSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string, onPageReset?: () => void) => void;
  clearSearch: (onPageReset?: () => void) => void;
}

/**
 * 動画検索機能を管理するhook
 */
export const useVideoSearch = (): UseVideoSearchResult => {
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