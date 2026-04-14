'use client';

import { NewsCategoryDto } from '../types/types';
import { NewsApi } from '../api/newsClient';
import { useApiQuery } from '@/hooks/useApi';

interface UseNewsCategoriesResult {
  categories: NewsCategoryDto[];
  loading: boolean;
  error: string | null;
}

/**
 * ニュースカテゴリ一覧を取得するフック
 */
export const useNewsCategories = (): UseNewsCategoriesResult => {
  const { data, loading, error } = useApiQuery(NewsApi.getCategories, {}, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    categories: data || [],
    loading,
    error: error?.message || null,
  };
};
