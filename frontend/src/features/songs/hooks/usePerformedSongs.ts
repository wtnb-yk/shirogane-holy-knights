'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { usePagination } from '@/features/videos/hooks/usePagination';
import { useVideoSearch } from '@/features/videos/hooks/useVideoSearch';
import { usePerformedSongsQuery } from './usePerformedSongsQuery';
import { PerformedSong, SortBy, SortOrder } from '../types/types';

interface UsePerformedSongsResult {
  songs: PerformedSong[];
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
}

interface UsePerformedSongsOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * 楽曲検索機能の統合hook
 * 検索、ページネーション、並び替え機能を統合
 */
export const usePerformedSongs = (options: UsePerformedSongsOptions = {}): UsePerformedSongsResult => {
  const { pageSize = 20, initialPage = 0 } = options;
  
  // 検索機能（動画と同じフックを使用）
  const { searchQuery, setSearchQuery, handleSearch, clearSearch } = useVideoSearch();
  
  // 並び替え状態
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.SING_COUNT);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  
  // ページネーション機能を先に初期化
  const [totalCount, setTotalCount] = useState(0);
  const { currentPage, totalPages, setCurrentPage, resetToFirstPage } = usePagination(
    { pageSize, initialPage },
    totalCount
  );
  
  // API呼び出し（currentPageを使用）
  const { songs, loading, error, totalCount: newTotalCount, hasMore } = usePerformedSongsQuery(
    { pageSize },
    { currentPage, searchQuery, sortBy, sortOrder }
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
  ]);
};