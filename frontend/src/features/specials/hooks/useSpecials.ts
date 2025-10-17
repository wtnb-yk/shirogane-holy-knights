'use client';

import { useMemo } from 'react';
import { SpecialEventDto, SpecialEventSearchResultDto } from '../types/types';
import { SpecialApi } from '../api/specialClient';
import { useApiQuery } from '@/hooks/useApi';
import { ApiError } from '@/utils/apiClient';

interface UseSpecialsResult {
  events: SpecialEventDto[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<SpecialEventSearchResultDto | null>;
}

/**
 * スペシャルイベント状態管理用のカスタムフック
 * ディスコグラフィー機能の既存フックパターンに完全準拠
 * API呼び出しとデータ取得を処理し、ローディング、エラー、成功状態を管理
 */
export const useSpecials = (): UseSpecialsResult => {
  // 空のパラメータでAPIクエリを実行（スペシャルイベントは全件取得）
  const apiParams = useMemo(() => ({}), []);

  // useApiQueryフックを使用してAPI呼び出しとデータ取得を処理
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