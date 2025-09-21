'use client';

import { useMemo } from 'react';
import { ConcertSongClient } from '../api/songClient';
import {
  ConcertSong,
  SortBy,
  SortOrder,
  SongFilterOptions,
  ConcertSongSearchParams
} from '../types/types';
import { useApiQuery } from '@/hooks/useApi';

interface UseConcertSongsQueryOptions {
  pageSize?: number;
}

interface UseConcertSongsQueryParams {
  currentPage: number;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filters: SongFilterOptions;
}

interface UseConcertSongsQueryResult {
  songs: ConcertSong[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

/**
 * コンサート楽曲データのAPI呼び出しを管理するhook
 * @param options API呼び出しのオプション
 * @param params 検索・フィルタパラメータ
 */
export const useConcertSongsQuery = (
  options: UseConcertSongsQueryOptions = {},
  params: UseConcertSongsQueryParams
): UseConcertSongsQueryResult => {
  const { pageSize = 20 } = options;
  const { currentPage, searchQuery, sortBy, sortOrder, filters } = params;

  // APIパラメータをメモ化
  const apiParams = useMemo((): ConcertSongSearchParams => ({
    page: currentPage,
    size: pageSize,
    query: searchQuery || undefined,
    sortBy,
    sortOrder,
    startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
    endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
    frequencyCategories: filters.frequencyCategories || undefined,
  }), [currentPage, pageSize, searchQuery, sortBy, sortOrder, filters.startDate, filters.endDate, filters.frequencyCategories]);

  // useApiQueryを使用
  const { data, loading, error } = useApiQuery(
    ConcertSongClient.callConcertSongsSearchFunction,
    apiParams,
    {
      retries: 3,
      retryDelay: 1000
    }
  );

  const totalCount = data?.totalCount || 0;
  const hasMore = (currentPage * pageSize) < totalCount;

  return {
    songs: data?.items || [],
    loading,
    error: error?.message || null,
    totalCount,
    hasMore,
  };
};