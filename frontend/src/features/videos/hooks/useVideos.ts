'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { usePagination } from './usePagination';
import { useVideoSearch } from './useVideoSearch';
import { useVideoFilters } from './useVideoFilters';
import { useAvailableTags } from './useAvailableTags';
import { useVideoQuery } from './useVideoQuery';
import { VideoDto } from '../types/types';
import { FilterOptions } from '../components/FilterBar';

interface UseVideosResult {
  videos: VideoDto[];
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

interface UseVideosOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * 動画機能の統合hook
 * 各機能を分離したhooksを組み合わせて使用
 */
export const useVideos = (options: UseVideosOptions = {}): UseVideosResult => {
  const { pageSize = 20, initialPage = 1 } = options;
  
  // 検索機能
  const { searchQuery, setSearchQuery, handleSearch, clearSearch } = useVideoSearch();
  
  // フィルター機能
  const { filters, setFilters, clearFilters } = useVideoFilters();
  
  // ページネーション機能を先に初期化
  const [totalCount, setTotalCount] = useState(0);
  const { currentPage, totalPages, setCurrentPage, resetToFirstPage } = usePagination(
    { pageSize, initialPage },
    totalCount
  );
  
  // API呼び出し（currentPageを使用）
  const { videos, loading, error, totalCount: newTotalCount, hasMore } = useVideoQuery(
    { pageSize },
    { currentPage, searchQuery, filters }
  );
  
  // totalCountの更新
  useEffect(() => {
    setTotalCount(newTotalCount);
  }, [newTotalCount]);
  
  // 利用可能なタグ抽出
  const { availableTags } = useAvailableTags(videos);

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
    videos,
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
    videos,
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