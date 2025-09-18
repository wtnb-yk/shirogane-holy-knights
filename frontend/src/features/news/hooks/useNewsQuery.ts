'use client';

import { useMemo } from 'react';
import { NewsDto, NewsFilterOptions, NewsSearchParamsDto } from '../types/types';
import { NewsApi } from '../api/newsClient';
import { useApiQuery } from '@/hooks/useApi';

interface UseNewsQueryOptions {
  pageSize: number;
}

interface UseNewsQueryParams {
  currentPage: number;
  searchQuery: string;
  filters: NewsFilterOptions;
}

interface UseNewsQueryResult {
  news: NewsDto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

/**
 * ニュースAPI呼び出しのフック (統合版：一覧取得と検索機能を統合)
 * 新しいAPIシステムを使用
 */
export const useNewsQuery = (
  options: UseNewsQueryOptions,
  params: UseNewsQueryParams
): UseNewsQueryResult => {
  const { pageSize } = options;
  const { currentPage, searchQuery, filters } = params;

  // APIパラメータをメモ化
  const apiParams = useMemo((): NewsSearchParamsDto => ({
    query: searchQuery.trim() || undefined,
    categoryIds: filters.categoryIds,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: currentPage,
    pageSize,
  }), [currentPage, searchQuery, filters.categoryIds, filters.startDate, filters.endDate, pageSize]);

  // 新しいAPIフックを使用
  const { data, loading, error } = useApiQuery(NewsApi.search, apiParams, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    news: data?.items || [],
    loading,
    error: error?.message || null,
    totalCount: data?.totalCount || 0,
    hasMore: data?.hasMore || false,
  };
};
