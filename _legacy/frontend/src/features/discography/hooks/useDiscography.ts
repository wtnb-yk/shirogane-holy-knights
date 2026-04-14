'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useDiscographyPagination } from './useDiscographyPagination';
import { useDiscographySearch } from './useDiscographySearch';
import { useDiscographyFilters } from './useDiscographyFilters';
import { useDiscographyQuery } from './useDiscographyQuery';
import { AlbumDto, AlbumFilterOptions } from '../types/types';
import { PAGINATION_CONFIG } from '../config/pagination';

interface UseDiscographyResult {
  albums: AlbumDto[];
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
  filters: AlbumFilterOptions;
  setFilters: (filters: AlbumFilterOptions) => void;
  clearAllFilters: () => void;
}

interface UseDiscographyOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * アルバム機能の統合hook
 * useNewsパターンに完全準拠
 */
export const useDiscography = (options: UseDiscographyOptions = {}): UseDiscographyResult => {
  const { pageSize = PAGINATION_CONFIG.PAGE_SIZE, initialPage = PAGINATION_CONFIG.INITIAL_PAGE } = options;

  // 検索機能
  const { searchQuery, setSearchQuery, handleSearch, clearSearch } = useDiscographySearch();

  // フィルター機能
  const { filters, setFilters, clearFilters } = useDiscographyFilters();

  // ページネーション機能を先に初期化
  const [totalCount, setTotalCount] = useState(0);
  const { currentPage, totalPages, setCurrentPage, resetToFirstPage } = useDiscographyPagination(
    { pageSize, initialPage },
    totalCount
  );

  // API呼び出し（currentPageを使用）
  const { albums, loading, error, totalCount: newTotalCount, hasMore } = useDiscographyQuery(
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

  const setFiltersWithReset = useCallback((newFilters: AlbumFilterOptions) => {
    setFilters(newFilters, resetToFirstPage);
  }, [setFilters, resetToFirstPage]);

  const clearAllFilters = useCallback(() => {
    clearFilters(resetToFirstPage);
    clearSearch(resetToFirstPage);
  }, [clearFilters, clearSearch, resetToFirstPage]);

  return useMemo(() => ({
    albums,
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
    albums,
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