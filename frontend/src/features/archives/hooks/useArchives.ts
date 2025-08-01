'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { usePagination } from './usePagination';
import { useArchiveSearch } from './useArchiveSearch';
import { useArchiveFilters } from './useArchiveFilters';
import { useAvailableTags } from './useAvailableTags';
import { useArchiveQuery } from './useArchiveQuery';
import { ArchiveDto } from '../types/types';
import { FilterOptions } from '../components/FilterBar';

interface UseArchivesResult {
  archives: ArchiveDto[];
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
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  availableTags: string[];
  clearAllFilters: () => void;
}

interface UseArchivesOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * アーカイブ機能の統合hook
 * 各機能を分離したhooksを組み合わせて使用
 */
export const useArchives = (options: UseArchivesOptions = {}): UseArchivesResult => {
  const { pageSize = 20, initialPage = 1 } = options;
  
  // 検索機能
  const { searchQuery, setSearchQuery, handleSearch, clearSearch } = useArchiveSearch();
  
  // フィルター機能
  const { filters, setFilters, clearFilters } = useArchiveFilters();
  
  // ページネーション機能を先に初期化
  const [totalCount, setTotalCount] = useState(0);
  const { currentPage, totalPages, setCurrentPage, resetToFirstPage } = usePagination(
    { pageSize, initialPage },
    totalCount
  );
  
  // API呼び出し（currentPageを使用）
  const { archives, loading, error, totalCount: newTotalCount, hasMore } = useArchiveQuery(
    { pageSize },
    { currentPage, searchQuery, filters }
  );
  
  // totalCountの更新
  useEffect(() => {
    setTotalCount(newTotalCount);
  }, [newTotalCount]);
  
  // 利用可能なタグ抽出
  const { availableTags } = useAvailableTags(archives);

  // ページリセット機能付きのハンドラー（useCallbackで安定化）
  const handleSearchWithReset = useCallback((query: string) => {
    handleSearch(query, resetToFirstPage);
  }, [handleSearch, resetToFirstPage]);

  const clearSearchWithReset = useCallback(() => {
    clearSearch(resetToFirstPage);
  }, [clearSearch, resetToFirstPage]);

  const setFiltersWithReset = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters, resetToFirstPage);
  }, [setFilters, resetToFirstPage]);

  const clearAllFilters = useCallback(() => {
    clearFilters(resetToFirstPage);
    clearSearch(resetToFirstPage);
  }, [clearFilters, clearSearch, resetToFirstPage]);

  return useMemo(() => ({
    archives,
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
    availableTags,
    clearAllFilters,
  }), [
    archives,
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
    availableTags,
    handleSearchWithReset,
    clearSearchWithReset,
    setFiltersWithReset,
    clearAllFilters,
  ]);
};