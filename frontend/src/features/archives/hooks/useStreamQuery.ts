'use client';

import { useMemo } from 'react';
import { StreamApi } from '../api/archiveClient';
import { StreamDto, StreamSearchParams } from '../types/types';
import { FilterOptions } from '../components/search/ArchiveFilterSection';
import { useApiQuery } from '@/hooks/useApi';

interface UseStreamQueryOptions {
  pageSize?: number;
}

interface UseStreamQueryParams {
  currentPage: number;
  searchQuery: string;
  filters: FilterOptions;
}

interface UseStreamQueryResult {
  streams: StreamDto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

/**
 * 配信データのAPI呼び出しを管理するhook
 * @param options API呼び出しのオプション
 * @param params 検索・フィルタパラメータ
 */
export const useStreamQuery = (
  options: UseStreamQueryOptions = {},
  params: UseStreamQueryParams
): UseStreamQueryResult => {
  const { pageSize = 20 } = options;
  const { currentPage, searchQuery, filters } = params;

  // APIパラメータをメモ化
  const apiParams = useMemo((): StreamSearchParams => ({
    page: currentPage,
    pageSize: pageSize,
    query: searchQuery || undefined,
    tags: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
    startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
    endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
  }), [currentPage, pageSize, searchQuery, filters.selectedTags, filters.startDate, filters.endDate]);

  // 新しいAPIフックを使用
  const { data, loading, error } = useApiQuery(StreamApi.search, apiParams, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    streams: data?.items || [],
    loading,
    error: error?.message || null,
    totalCount: data?.totalCount || 0,
    hasMore: data?.hasMore || false,
  };
};
