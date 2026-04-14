import {ERROR_MESSAGES} from './constants';

export interface ApiError {
  error: string;
  statusCode?: number;
  details?: any;
}

export interface ErrorInfo {
  message: string;
  type: 'network' | 'validation' | 'server' | 'client' | 'offline';
  statusCode?: number;
  retryable: boolean;
  userFriendly: boolean;
}

/**
 * エラーを分析してユーザーフレンドリーなメッセージに変換
 */
export const analyzeError = (error: unknown): ErrorInfo => {
  // ネットワークエラーの検出
  if (!navigator.onLine) {
    return {
      message: ERROR_MESSAGES.OFFLINE_ERROR,
      type: 'offline',
      retryable: true,
      userFriendly: true
    };
  }

  // API エラーの処理
  if (isApiError(error)) {
    const statusCode = error.statusCode;
    
    switch (statusCode) {
      case 400:
        return {
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          type: 'validation',
          statusCode,
          retryable: false,
          userFriendly: true
        };
      case 401:
        return {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          type: 'client',
          statusCode,
          retryable: false,
          userFriendly: true
        };
      case 403:
        return {
          message: ERROR_MESSAGES.FORBIDDEN,
          type: 'client',
          statusCode,
          retryable: false,
          userFriendly: true
        };
      case 404:
        return {
          message: ERROR_MESSAGES.NOT_FOUND,
          type: 'client',
          statusCode,
          retryable: false,
          userFriendly: true
        };
      case 408:
      case 504:
        return {
          message: ERROR_MESSAGES.TIMEOUT_ERROR,
          type: 'network',
          statusCode,
          retryable: true,
          userFriendly: true
        };
      case 500:
      case 502:
      case 503:
        return {
          message: ERROR_MESSAGES.SERVER_ERROR,
          type: 'server',
          statusCode,
          retryable: true,
          userFriendly: true
        };
      default:
        return {
          message: ERROR_MESSAGES.SERVER_ERROR,
          type: 'server',
          statusCode,
          retryable: true,
          userFriendly: true
        };
    }
  }

  // ネットワークエラー（fetch失敗など）
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      type: 'network',
      retryable: true,
      userFriendly: true
    };
  }

  // その他のエラー
  if (error instanceof Error) {
    return {
      message: ERROR_MESSAGES.GENERIC_ERROR,
      type: 'client',
      retryable: false,
      userFriendly: true
    };
  }

  // 不明なエラー
  return {
    message: ERROR_MESSAGES.GENERIC_ERROR,
    type: 'client',
    retryable: false,
    userFriendly: true
  };
};

/**
 * エラーがAPIエラーかどうかを判定
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as any).error === 'string'
  );
};

/**
 * エラーメッセージを取得（フォールバック付き）
 */
export const getErrorMessage = (error: unknown): string => {
  const errorInfo = analyzeError(error);
  return errorInfo.message;
};

/**
 * エラーが再試行可能かどうかを判定
 */
export const isRetryableError = (error: unknown): boolean => {
  const errorInfo = analyzeError(error);
  return errorInfo.retryable;
};

/**
 * エラーログを記録（開発環境では詳細、本番環境では最小限）
 */
export const logError = (error: unknown, context?: string) => {
  const errorInfo = analyzeError(error);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  } else {
    // 本番環境では最小限のログ
    console.error(`[${context || 'Error'}] ${errorInfo.type}: ${errorInfo.message}`);
    
    // ここで外部のエラー監視サービスに送信
    // Example: Sentry.captureException(error, { tags: { context } });
  }
};

/**
 * エラーハンドリング用のヘルパー関数
 */
export const createErrorHandler = (context: string) => {
  return (error: unknown) => {
    logError(error, context);
    return analyzeError(error);
  };
};
