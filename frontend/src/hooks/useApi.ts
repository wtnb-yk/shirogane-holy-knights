'use client';

import {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {ApiError, isRetryableError, logApiError} from '@/utils/apiClient';
import {useNetworkStatus} from './useNetworkStatus';

interface UseApiOptions {
  immediate?: boolean;
  retries?: number;
  retryDelay?: number;
  debounceMs?: number;
  onError?: (error: ApiError) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * 統一されたAPIフック
 * 自動リトライ、エラーハンドリング、ローディング状態を管理
 */
export function useApi<T>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    retries = 3,
    retryDelay = 1000,
    onError
  } = options;

  const {isOnline} = useNetworkStatus();
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({...prev, loading: true, error: null}));

    let lastError: ApiError | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await apiCall(...args);
        setState({data: result, loading: false, error: null});
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        lastError = apiError;

        logApiError(apiError, `Attempt ${attempt}/${retries}`);

        // オフラインまたは再試行不可能なエラーの場合は即座に終了
        if (!isOnline || !isRetryableError(apiError)) {
          break;
        }

        // 最後の試行でない場合は待機
        if (attempt < retries) {
          await new Promise(resolve =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1))
          );
        }
      }
    }

    setState({data: null, loading: false, error: lastError});

    if (lastError && onError) {
      onError(lastError);
    }

    return null;
  }, [apiCall, retries, retryDelay, isOnline, onError]);

  const reset = useCallback(() => {
    setState({data: null, loading: false, error: null});
  }, []);

  // immediate実行
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset
  };
}

/**
 * 検索用のAPIフック（パラメータ変更時に自動実行）
 */
export function useApiQuery<T, P>(
  apiCall: (params: P) => Promise<T>,
  params: P,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {debounceMs = 300, ...apiOptions} = options;
  const apiHook = useApi(apiCall, {...apiOptions, immediate: false});
  const prevParamsRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // パラメータの変更を検出
  const paramsString = useMemo(() => JSON.stringify(params), [params]);

  // execute関数を安定化
  const {execute} = apiHook;

  useEffect(() => {
    // 前回のパラメータと比較して変更があった場合のみ実行
    if (prevParamsRef.current !== paramsString) {
      prevParamsRef.current = paramsString;

      // 既存のタイマーをクリア
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // デバウンス処理
      timeoutRef.current = setTimeout(() => {
        execute(params);
      }, debounceMs);
    }
  }, [paramsString, params, execute, debounceMs]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return apiHook;
}

/**
 * ページネーション用のAPIフック
 */
export function useApiPagination<T>(
  apiCall: (page: number, pageSize: number, ...args: any[]) => Promise<T>,
  initialPage = 1,
  pageSize = 20,
  options: UseApiOptions = {}
): UseApiReturn<T> & {
  page: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
} {
  const [page, setPage] = useState(initialPage);
  const apiHook = useApi(apiCall, {...options, immediate: false});

  // execute関数を安定化
  const {execute} = apiHook;

  useEffect(() => {
    execute(page, pageSize);
  }, [page, pageSize, execute]);

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  return {
    ...apiHook,
    page,
    setPage,
    nextPage,
    prevPage
  };
}
