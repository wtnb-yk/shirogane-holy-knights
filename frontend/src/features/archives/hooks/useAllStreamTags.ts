'use client';

import { StreamApi } from '../api/lambdaClient';
import { useApiQuery } from '@/hooks/useApi';

interface UseAllStreamTagsResult {
  tags: string[];
  loading: boolean;
  error: string | null;
}

/**
 * 全ての配信タグを取得するhook
 */
export const useAllStreamTags = (): UseAllStreamTagsResult => {
  const { data, loading, error } = useApiQuery(StreamApi.getAllTags, {}, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    tags: data || [],
    loading,
    error: error?.message || null,
  };
};
