'use client';

import { useState, useEffect } from 'react';
import { LambdaClient } from '../api/lambdaClient';
import { ArchiveDto } from '../types/types';
import { FilterOptions } from '../components/FilterBar';

interface UseArchiveQueryOptions {
  pageSize?: number;
}

interface UseArchiveQueryParams {
  currentPage: number;
  searchQuery: string;
  filters: FilterOptions;
}

interface UseArchiveQueryResult {
  archives: ArchiveDto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
}

/**
 * アーカイブデータのAPI呼び出しを管理するhook
 * @param options API呼び出しのオプション
 * @param params 検索・フィルタパラメータ
 */
export const useArchiveQuery = (
  options: UseArchiveQueryOptions = {},
  params: UseArchiveQueryParams
): UseArchiveQueryResult => {
  const { pageSize = 20 } = options;
  const { currentPage, searchQuery, filters } = params;
  
  const [archives, setArchives] = useState<ArchiveDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchResult = await LambdaClient.callArchiveSearchFunction({
          page: currentPage,
          pageSize: pageSize,
          query: searchQuery || undefined,
          tags: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
          startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
          endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
        });
        
        setArchives(searchResult.items || []);
        setTotalCount(searchResult.totalCount);
        setHasMore(searchResult.hasMore);
        
      } catch (err) {
        setError('アーカイブの取得に失敗しました。');
        console.error('Error fetching archives:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, [currentPage, pageSize, searchQuery, filters]);

  return {
    archives,
    loading,
    error,
    totalCount,
    hasMore,
  };
};