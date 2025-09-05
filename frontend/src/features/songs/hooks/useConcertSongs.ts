'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { usePagination } from '@/features/archives/hooks/usePagination';
import { useVideoSearch } from '@/features/archives/hooks/useVideoSearch';
import { useConcertSongsQuery } from './useConcertSongsQuery';
import { ConcertSong, SortBy, SortOrder, SongFilterOptions } from '../types/types';

interface UseConcertSongsResult {
  songs: ConcertSong[];
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
  sortBy: SortBy;
  sortOrder: SortOrder;
  handleSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  filters: SongFilterOptions;
  setFilters: (filters: SongFilterOptions) => void;
  clearAllFilters: () => void;
}

interface UseConcertSongsOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * コンサート楽曲検索機能の統合hook
 * 検索、ページネーション、並び替え機能を統合
 */
export const useConcertSongs = (options: UseConcertSongsOptions = {}): UseConcertSongsResult => {
  const { pageSize = 20, initialPage = 1 } = options;
  
  // 検索機能（動画と同じフックを使用）
  const { searchQuery, setSearchQuery, handleSearch, clearSearch } = useVideoSearch();
  
  // 並び替え状態
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.LATEST_SING_DATE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  
  // フィルター状態
  const [filters, setFilters] = useState<SongFilterOptions>({});
  
  // ページネーション機能を先に初期化
  const [totalCount, setTotalCount] = useState(0);
  const { currentPage, totalPages, setCurrentPage, resetToFirstPage } = usePagination(
    { pageSize, initialPage },
    totalCount
  );
  
  // API呼び出し（currentPageを使用）
  const { songs, loading, error, totalCount: newTotalCount, hasMore } = useConcertSongsQuery(
    { pageSize },
    { currentPage, searchQuery, sortBy, sortOrder, filters }
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

  const handleSortChange = useCallback((newSortBy: SortBy, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    resetToFirstPage();
  }, [resetToFirstPage]);

  const setFiltersWithReset = useCallback((newFilters: SongFilterOptions) => {
    setFilters(newFilters);
    resetToFirstPage();
  }, [resetToFirstPage]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    clearSearch(resetToFirstPage);
  }, [clearSearch, resetToFirstPage]);

  return useMemo(() => ({
    songs,
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
    sortBy,
    sortOrder,
    handleSortChange,
    filters,
    setFilters: setFiltersWithReset,
    clearAllFilters,
  }), [
    songs,
    loading,
    error,
    currentPage,
    totalCount,
    hasMore,
    totalPages,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    handleSearchWithReset,
    clearSearchWithReset,
    sortBy,
    sortOrder,
    handleSortChange,
    filters,
    setFiltersWithReset,
    clearAllFilters,
  ]);
};