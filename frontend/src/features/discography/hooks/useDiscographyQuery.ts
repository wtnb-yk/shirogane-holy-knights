'use client';

import { useMemo } from 'react';
import { AlbumDto, AlbumFilterOptions, AlbumSearchParamsDto } from '../types/types';
import { AlbumApi } from '../api/discographyClient';
import { useApiQuery } from '@/hooks/useApi';

interface UseDiscographyQueryOptions {
  pageSize: number;
}

interface UseDiscographyQueryParams {
  currentPage: number;
  searchQuery: string;
  filters: AlbumFilterOptions;
}

interface UseDiscographyQueryResult {
  albums: AlbumDto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

/**
 * アルバムAPI呼び出しのフック (統合版：一覧取得と検索機能を統合)
 * useNewsQueryパターンに完全準拠
 */
export const useDiscographyQuery = (
  options: UseDiscographyQueryOptions,
  params: UseDiscographyQueryParams
): UseDiscographyQueryResult => {
  const { pageSize } = options;
  const { currentPage, searchQuery, filters } = params;

  // APIパラメータをメモ化
  const apiParams = useMemo((): AlbumSearchParamsDto => ({
    query: searchQuery.trim() || undefined,
    albumTypes: filters.albumTypes,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: currentPage,
    pageSize,
  }), [currentPage, searchQuery, filters.albumTypes, filters.startDate, filters.endDate, pageSize]);

  // 新しいAPIフックを使用
  const { data, loading, error } = useApiQuery(AlbumApi.search, apiParams, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    albums: data?.items || [],
    loading,
    error: error?.message || null,
    totalCount: data?.totalCount || 0,
    hasMore: data?.hasMore || false,
  };
};