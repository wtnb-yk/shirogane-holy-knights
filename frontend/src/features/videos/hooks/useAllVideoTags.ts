'use client';

import useSWR from 'swr';

interface UseAllVideoTagsResult {
  tags: string[];
  loading: boolean;
  error: string | null;
}

const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
};

const fetcher = async (url: string): Promise<string[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('動画タグの取得に失敗しました');
  }
  return response.json();
};

/**
 * 全ての動画タグを取得するhook
 */
export const useAllVideoTags = (): UseAllVideoTagsResult => {
  const { data, error, isLoading } = useSWR(
    `${API_CONFIG.baseUrl}/video-tags`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5分間キャッシュ
    }
  );

  return {
    tags: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
};