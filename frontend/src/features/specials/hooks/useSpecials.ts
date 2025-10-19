'use client';

import { useMemo } from 'react';
import { SpecialEventDto } from '../types/types';
import { SpecialApi } from '../api/specialClient';
import { useApiQuery } from '@/hooks/useApi';
import { ApiError } from '@/utils/apiClient';

interface UseSpecialsResult {
  events: SpecialEventDto[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

/**
 * スペシャルイベント状態管理用のカスタムフック
 * API呼び出しとデータ取得を処理し、ローディング、エラー、成功状態を管理
 */
export const useSpecials = (): UseSpecialsResult => {
  const apiParams = useMemo(() => ({}), []);

  const { data, loading, error, execute } = useApiQuery(
    SpecialApi.getSpecialEvents,
    apiParams,
    {
      retries: 2,
      retryDelay: 2000
    }
  );

  return {
    events: data?.items || [],
    loading,
    error,
    refetch: execute,
  };
};