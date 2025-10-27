'use client';

import { useMemo } from 'react';
import { SpecialEventDetailDto } from '../types/types';
import { SpecialApi } from '../api/specialClient';
import { useApiQuery } from '@/hooks/useApi';
import { ApiError } from '@/utils/apiClient';

interface UseSpecialEventDetailResult {
  eventDetail: SpecialEventDetailDto | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<SpecialEventDetailDto | null>;
}

/**
 * スペシャルイベント詳細取得用のカスタムフック
 * API呼び出しとデータ取得を処理し、ローディング、エラー、成功状態を管理
 */
export const useSpecialEventDetail = (eventId: string): UseSpecialEventDetailResult => {
  const apiParams = useMemo(() => ({ eventId }), [eventId]);

  const { data, loading, error, execute } = useApiQuery(
    () => SpecialApi.getSpecialEventDetails(eventId),
    apiParams,
    {
      retries: 2,
      retryDelay: 2000
    }
  );

  return {
    eventDetail: data,
    loading,
    error,
    refetch: execute,
  };
};
