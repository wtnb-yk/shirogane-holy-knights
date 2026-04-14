'use client';

import { AlbumTypeDto } from '../types/types';
import { AlbumApi } from '../api/discographyClient';
import { useApiQuery } from '@/hooks/useApi';

interface UseAlbumTypesResult {
  albumTypes: AlbumTypeDto[];
  loading: boolean;
  error: string | null;
}

/**
 * カテゴリ一覧を取得するフック
 */
export const useAlbumTypes = (): UseAlbumTypesResult => {
  const { data, loading, error } = useApiQuery(AlbumApi.getTypes, {}, {
    retries: 2,
    retryDelay: 2000
  });

  return {
    albumTypes: data || [],
    loading,
    error: error?.message || null,
  };
};
