'use client';

import { useMemo } from 'react';
import { VideoApi } from '../api/archiveClient';
import { VideoDto, VideoSearchParams } from '../types/types';
import { FilterOptions } from '../components/search/ArchiveFilterSection';
import { useApiQuery } from '@/hooks/useApi';

interface UseVideoQueryOptions {
  pageSize?: number;
}

interface UseVideoQueryParams {
  currentPage: number;
  searchQuery: string;
  filters: FilterOptions;
}

interface UseVideoQueryResult {
  videos: VideoDto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

/**
 * 動画データのAPI呼び出しを管理するhook
 * @param options API呼び出しのオプション
 * @param params 検索・フィルタパラメータ
 */
export const useVideoQuery = (
  options: UseVideoQueryOptions = {},
  params: UseVideoQueryParams
): UseVideoQueryResult => {
  const { pageSize = 20 } = options;
  const { currentPage, searchQuery, filters } = params;

  // APIパラメータをメモ化
  const apiParams = useMemo((): VideoSearchParams => ({
    page: currentPage,
    pageSize: pageSize,
    query: searchQuery || undefined,
    tags: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
    startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
    endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
  }), [currentPage, pageSize, searchQuery, filters.selectedTags, filters.startDate, filters.endDate]);

  // 新しいAPIフックを使用
  const { data, loading, error } = useApiQuery(VideoApi.search, apiParams, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    videos: data?.items || [],
    loading,
    error: error?.message || null,
    totalCount: data?.totalCount || 0,
    hasMore: data?.hasMore || false,
  };
};
