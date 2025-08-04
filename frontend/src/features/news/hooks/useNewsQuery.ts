'use client';

import { useState, useEffect } from 'react';
import { NewsDto, NewsSearchParamsDto, NewsListParamsDto, NewsSearchResultDto, NewsFilterOptions } from '../types/types';
import { NewsClient } from '../api/newsClient';

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
        
        let result: NewsSearchResultDto;
        
        // 検索クエリがある場合は検索API、そうでなければ一覧API
        if (searchQuery.trim()) {
          result = await NewsClient.searchNews({
            query: searchQuery,
            categoryId: filters.categoryId,
            startDate: filters.startDate,
            endDate: filters.endDate,
            page: currentPage,
            pageSize,
          });
        } else {
          result = await NewsClient.getNewsList({
            categoryId: filters.categoryId,
            page: currentPage,
            pageSize,
          });
        }
        
        setNews(result.items);
        setTotalCount(result.totalCount);
        setHasMore(result.hasMore);
      } catch (err) {
        setError('ニュースの取得に失敗しました。');
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