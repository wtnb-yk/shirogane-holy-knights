import { ERROR_MESSAGES } from './constants';

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    statusCode?: number;
    type: 'network' | 'server' | 'client' | 'timeout' | 'offline';
}

/**
 * 統一されたAPIクライアント
 * エラーハンドリング、タイムアウト、リトライを内蔵
 */
class ApiClient {
    private readonly baseUrl: string;
    private defaultTimeout: number;

    constructor(baseUrl?: string, timeout = 30000) {
        // 開発環境ではプロキシ経由
        if (process.env.NODE_ENV === 'development') {
            this.baseUrl = '/api';
        } else {
            this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || '';
        }
        this.defaultTimeout = timeout;
    }

    /**
     * 統一されたfetchメソッド
     */
    private async fetchWithErrorHandling<T>(
        endpoint: string,
        options: RequestInit = {},
        timeout = this.defaultTimeout
    ): Promise<T> {
        // オフライン検出
        if (!navigator.onLine) {
            throw this.createError(ERROR_MESSAGES.OFFLINE_ERROR, 0, 'offline');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        let response: Response;

        try {
            response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
        } catch (error) {
            clearTimeout(timeoutId);

            // AbortErrorの場合（タイムアウト）
            if (error instanceof Error && error.name === 'AbortError') {
                throw this.createError(ERROR_MESSAGES.TIMEOUT_ERROR, 408, 'timeout');
            }

            // ネットワークエラーの場合（TypeError）
            if (error instanceof TypeError) {
                throw this.createError(ERROR_MESSAGES.NETWORK_ERROR, 0, 'network');
            }

            // その他の予期しないエラー
            throw this.createError(ERROR_MESSAGES.GENERIC_ERROR, 0, 'client');
        }

        clearTimeout(timeoutId);

        // レスポンスステータスチェック
        if (!response.ok) {
            throw this.createError(
                this.getErrorMessageByStatus(response.status),
                response.status,
                this.getErrorTypeByStatus(response.status)
            );
        }

        // JSONパース
        try {
            return await response.json();
        } catch (error) {
            throw this.createError(ERROR_MESSAGES.GENERIC_ERROR, response.status, 'client');
        }
    }

    /**
     * GET リクエスト
     */
    async get<T>(endpoint: string, timeout?: number): Promise<T> {
        return this.fetchWithErrorHandling<T>(endpoint, { method: 'GET' }, timeout);
    }

    /**
     * POST リクエスト
     */
    async post<T>(endpoint: string, data?: any, timeout?: number): Promise<T> {
        return this.fetchWithErrorHandling<T>(
            endpoint,
            {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined,
            },
            timeout
        );
    }

    /**
     * PUT リクエスト
     */
    async put<T>(endpoint: string, data?: any, timeout?: number): Promise<T> {
        return this.fetchWithErrorHandling<T>(
            endpoint,
            {
                method: 'PUT',
                body: data ? JSON.stringify(data) : undefined,
            },
            timeout
        );
    }

    /**
     * DELETE リクエスト
     */
    async delete<T>(endpoint: string, timeout?: number): Promise<T> {
        return this.fetchWithErrorHandling<T>(endpoint, { method: 'DELETE' }, timeout);
    }

    /**
     * エラーオブジェクトを作成
     */
    private createError(message: string, statusCode: number, type: ApiError['type']): ApiError {
        return { message, statusCode, type };
    }

    /**
     * ステータスコードに基づいてエラーメッセージを取得
     */
    private getErrorMessageByStatus(status: number): string {
        switch (status) {
            case 400:
                return ERROR_MESSAGES.VALIDATION_ERROR;
            case 401:
                return ERROR_MESSAGES.UNAUTHORIZED;
            case 403:
                return ERROR_MESSAGES.FORBIDDEN;
            case 404:
                return ERROR_MESSAGES.NOT_FOUND;
            case 408:
            case 504:
                return ERROR_MESSAGES.TIMEOUT_ERROR;
            case 500:
            case 502:
            case 503:
                return ERROR_MESSAGES.SERVER_ERROR;
            default:
                return ERROR_MESSAGES.SERVER_ERROR;
        }
    }

    /**
     * ステータスコードに基づいてエラータイプを取得
     */
    private getErrorTypeByStatus(status: number): ApiError['type'] {
        if (status >= 400 && status < 500) {
            return 'client';
        }
        if (status >= 500) {
            return 'server';
        }
        return 'network';
    }
}

// デフォルトのAPIクライアントインスタンス
export const apiClient = new ApiClient();

/**
 * エラーが再試行可能かどうかを判定
 */
export const isRetryableError = (error: ApiError): boolean => {
    return ['network', 'server', 'timeout'].includes(error.type);
};

/**
 * エラーログを記録
 */
export const logApiError = (error: ApiError, context?: string) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(`[API Error - ${context || 'Unknown'}]`, {
            message: error.message,
            statusCode: error.statusCode,
            type: error.type,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    } else {
        console.error(`[API Error] ${error.type}: ${error.message}`);
    }
};
