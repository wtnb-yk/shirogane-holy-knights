'use client';

import { useMemo } from 'react';
import { SongClient } from '../api/songClient';
import {
  StreamSong,
  SortBy,
  SortOrder,
  SongFilterOptions,
  StreamSongSearchParams
} from '../types/types';
import { useApiQuery } from '@/hooks/useApi';

interface UseStreamSongsQueryOptions {
  pageSize?: number;
}

interface UseStreamSongsQueryState {
  currentPage: number;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filters: SongFilterOptions;
}

interface UseStreamSongsQueryResult {
  songs: StreamSong[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export const useStreamSongsQuery = (
  options: UseStreamSongsQueryOptions,
  state: UseStreamSongsQueryState
): UseStreamSongsQueryResult => {
  const { pageSize = 12 } = options;
  const { currentPage, searchQuery, sortBy, sortOrder, filters } = state;

  // APIパラメータをメモ化
  const apiParams = useMemo((): StreamSongSearchParams => ({
    query: searchQuery || undefined,
    sortBy,
    sortOrder,
    startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
    endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
    frequencyCategories: filters.frequencyCategories,
    page: currentPage,
    pageSize: pageSize,
  }), [currentPage, pageSize, searchQuery, sortBy, sortOrder, filters.startDate, filters.endDate, filters.frequencyCategories]);

  // useApiQueryを使用
  const { data, loading, error } = useApiQuery(
    SongClient.callStreamSongsSearchFunction,
    apiParams,
    {
      retries: 3,
      retryDelay: 1000
    }
  );

  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasMore = currentPage * pageSize < totalCount;

  return {
    songs: data?.items || [],
    loading,
    error: error?.message || null,
    totalCount,
    totalPages,
    hasMore,
  };
};
