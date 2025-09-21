'use client';

import { VideoApi } from '../api/lambdaClient';
import { useApiQuery } from '@/hooks/useApi';

interface UseAllVideoTagsResult {
  tags: string[];
  loading: boolean;
  error: string | null;
}

/**
 * 全ての動画タグを取得するhook
 */
export const useAllVideoTags = (): UseAllVideoTagsResult => {
  const { data, loading, error } = useApiQuery(VideoApi.getAllTags, {}, {
    retries: 3,
    retryDelay: 1000
  });

  return {
    tags: data || [],
    loading,
    error: error?.message || null,
  };
};
