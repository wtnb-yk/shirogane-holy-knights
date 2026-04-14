'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVideoSearchResult {
  searchQuery: string;
  debouncedSearchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string, onPageReset?: () => void) => void;
  clearSearch: (onPageReset?: () => void) => void;
  isSearching: boolean;
}

/**
 * 動画検索機能を管理するhook（デバウンス機能付き）
 */
export const useVideoSearch = (debounceMs: number = 300): UseVideoSearchResult => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search query
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, debouncedSearchQuery, debounceMs]);

  const handleSearch = useCallback((query: string, onPageReset?: () => void) => {
    setSearchQuery(query);
    onPageReset?.();
  }, []);

  const clearSearch = useCallback((onPageReset?: () => void) => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setIsSearching(false);
    onPageReset?.();
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  return {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    handleSearch,
    clearSearch,
    isSearching,
  };
};