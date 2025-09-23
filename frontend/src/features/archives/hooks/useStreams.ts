'use client';

import {useMemo, useState, useEffect, useCallback} from 'react';
import {usePagination} from './usePagination';
import {useVideoSearch} from './useVideoSearch';
import {useVideoFilters} from './useVideoFilters';
import {useAllStreamTags} from './useAllStreamTags';
import {useStreamQuery} from './useStreamQuery';
import {StreamDto} from '../types/types';
import {FilterOptions} from '../components/search/filter/ArchiveFilterSection';

interface UseStreamsResult {
  streams: StreamDto[];
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
  hasActiveFilters: boolean;
}

interface UseStreamsOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * 配信機能の統合hook
 * 各機能を分離したhooksを組み合わせて使用
 */
export const useStreams = (options: UseStreamsOptions = {}): UseStreamsResult => {
  const {pageSize = 20, initialPage = 1} = options;

  // 検索機能（動画と同じフックを使用）
  const {searchQuery, setSearchQuery, handleSearch, clearSearch} = useVideoSearch();

  // フィルター機能（動画と同じフックを使用）
  const {filters, setFilters, clearFilters, hasActiveFilters} = useVideoFilters();

  // ページネーション機能を先に初期化
  const [totalCount, setTotalCount] = useState(0);
  const {currentPage, totalPages, setCurrentPage, resetToFirstPage} = usePagination(
    {pageSize, initialPage},
    totalCount
  );

  // API呼び出し（currentPageを使用）
  const {streams, loading, error, totalCount: newTotalCount, hasMore} = useStreamQuery(
    {pageSize},
    {currentPage, searchQuery, filters}
  );

  // totalCountの更新
  useEffect(() => {
    setTotalCount(newTotalCount);
  }, [newTotalCount]);

  // 全ての配信タグを取得
  const {tags: availableTags} = useAllStreamTags();

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
    streams,
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
    hasActiveFilters,
  }), [
    streams,
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
    hasActiveFilters,
  ]);
};
