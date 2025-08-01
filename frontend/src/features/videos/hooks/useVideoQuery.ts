'use client';

import { useState, useEffect } from 'react';
import { LambdaClient } from '../api/lambdaClient';
import { VideoDto } from '../types/types';
import { FilterOptions } from '../components/FilterBar';

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
  
  const [videos, setVideos] = useState<VideoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchResult = await LambdaClient.callVideoSearchFunction({
          page: currentPage,
          pageSize: pageSize,
          query: searchQuery || undefined,
          tags: filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
          startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
          endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
        });
        
        setVideos(searchResult.items || []);
        setTotalCount(searchResult.totalCount);
        setHasMore(searchResult.hasMore);
        
      } catch (err) {
        setError('動画の取得に失敗しました。');
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [currentPage, pageSize, searchQuery, filters]);

  return {
    videos,
    loading,
    error,
    totalCount,
    hasMore,
  };
};