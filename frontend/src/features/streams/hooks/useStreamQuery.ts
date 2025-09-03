'use client';

import { useState, useEffect } from 'react';
import { StreamClient } from '../api/lambdaClient';
import { StreamDto } from '../types/types';
import { FilterOptions } from '../components/filter/VideoFilterSection';

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
  
  const [streams, setStreams] = useState<StreamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchResult = await StreamClient.callStreamSearchFunction({
          page: currentPage,
          pageSize: pageSize,
          query: searchQuery || undefined,
          tags: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
          startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
          endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
        });
        
        setStreams(searchResult.items || []);
        setTotalCount(searchResult.totalCount);
        setHasMore(searchResult.hasMore);
        
      } catch (err) {
        setError('配信の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [currentPage, pageSize, searchQuery, filters]);

  return {
    streams,
    loading,
    error,
    totalCount,
    hasMore,
  };
};