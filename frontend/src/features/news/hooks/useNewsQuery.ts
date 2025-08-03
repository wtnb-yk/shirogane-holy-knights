'use client';

import { useState, useEffect } from 'react';
import { NewsDto, NewsSearchParamsDto, NewsListParamsDto, NewsSearchResultDto, NewsFilterOptions } from '../types/types';

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
 * ニュースAPI呼び出しのフック
 */
export const useNewsQuery = (
  options: UseNewsQueryOptions,
  params: UseNewsQueryParams
): UseNewsQueryResult => {
  const { pageSize } = options;
  const { currentPage, searchQuery, filters } = params;

  const [news, setNews] = useState<NewsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        let response: Response;
        let endpoint: string;
        let requestBody: NewsSearchParamsDto | NewsListParamsDto;

        // 検索クエリがある場合は検索API、そうでなければ一覧API
        if (searchQuery.trim()) {
          endpoint = '/api/newsSearch';
          requestBody = {
            query: searchQuery,
            categoryId: filters.categoryId,
            startDate: filters.startDate,
            endDate: filters.endDate,
            page: currentPage,
            pageSize,
          };
        } else {
          endpoint = '/api/newsList';
          requestBody = {
            categoryId: filters.categoryId,
            page: currentPage,
            pageSize,
          };
        }

        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('ニュースの取得に失敗しました');
        }

        const data: NewsSearchResultDto = await response.json();
        
        setNews(data.items);
        setTotalCount(data.totalCount);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setNews([]);
        setTotalCount(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, searchQuery, filters.categoryId, filters.startDate, filters.endDate, pageSize]);

  return {
    news,
    loading,
    error,
    totalCount,
    hasMore,
  };
};