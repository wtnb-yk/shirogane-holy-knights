'use client';

import useSWR from 'swr';

interface UseAllStreamTagsResult {
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
    throw new Error('配信タグの取得に失敗しました');
  }
  return response.json();
};

/**
 * 全ての配信タグを取得するhook
 */
export const useAllStreamTags = (): UseAllStreamTagsResult => {
  const { data, error, isLoading } = useSWR(
    `${API_CONFIG.baseUrl}/stream-tags`,
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