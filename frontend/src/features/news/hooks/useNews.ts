'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNewsPagination } from './useNewsPagination';
import { useNewsSearch } from './useNewsSearch';
import { useNewsFilters } from './useNewsFilters';
import { useNewsQuery } from './useNewsQuery';
import { NewsDto, NewsFilterOptions } from '../types/types';

interface UseNewsResult {
  news: NewsDto[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;
  clearSearch: () => void;
  filters: NewsFilterOptions;
  setFilters: (filters: NewsFilterOptions) => void;
  clearAllFilters: () => void;
}

interface UseNewsOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * ニュース機能の統合hook
 * 各機能を分離したhooksを組み合わせて使用
 */
export const useNews = (options: UseNewsOptions = {}): UseNewsResult => {
  const { pageSize = 20, initialPage = 1 } = options;
  
  // 検索機能
  const { searchQuery, setSearchQuery, handleSearch, clearSearch } = useNewsSearch();
  
  // フィルター機能
  const { filters, setFilters, clearFilters } = useNewsFilters();
  
  // ページネーション機能を先に初期化
  const [totalCount, setTotalCount] = useState(0);
  const { currentPage, totalPages, setCurrentPage, resetToFirstPage } = useNewsPagination(
    { pageSize, initialPage },
    totalCount
  );
  
  // API呼び出し（currentPageを使用）
  const { news, loading, error, totalCount: newTotalCount, hasMore } = useNewsQuery(
    { pageSize },
    { currentPage, searchQuery, filters }
  );
  
  // totalCountの更新
  useEffect(() => {
    setTotalCount(newTotalCount);
  }, [newTotalCount]);

  // ページリセット機能付きのハンドラー（useCallbackで安定化）
  const handleSearchWithReset = useCallback((query: string) => {
    handleSearch(query, resetToFirstPage);
  }, [handleSearch, resetToFirstPage]);

  const clearSearchWithReset = useCallback(() => {
    clearSearch(resetToFirstPage);
  }, [clearSearch, resetToFirstPage]);

  const setFiltersWithReset = useCallback((newFilters: NewsFilterOptions) => {
    setFilters(newFilters, resetToFirstPage);
  }, [setFilters, resetToFirstPage]);

  const clearAllFilters = useCallback(() => {
    clearFilters(resetToFirstPage);
    clearSearch(resetToFirstPage);
  }, [clearFilters, clearSearch, resetToFirstPage]);

  return useMemo(() => ({
    news,
    loading,
    error,
    currentPage,
    totalCount,
    hasMore,
    totalPages,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    handleSearch: handleSearchWithReset,
    clearSearch: clearSearchWithReset,
    filters,
    setFilters: setFiltersWithReset,
    clearAllFilters,
  }), [
    news,
    loading,
    error,
    currentPage,
    totalCount,
    hasMore,
    totalPages,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    filters,
    handleSearchWithReset,
    clearSearchWithReset,
    setFiltersWithReset,
    clearAllFilters,
  ]);
};