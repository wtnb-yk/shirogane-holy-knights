import { ArchiveSearchParams, ArchiveSearchResult, ApiError } from './types';

/**
 * Lambda関数のエンドポイント設定
 */
const API_CONFIG = {
  // 環境変数から取得するか、デフォルトとしてlocalhostを使用
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
};

/**
 * Lambda関数クライアント
 * Spring Cloud Functionで実装されたLambda関数を呼び出すためのクライアント
 */
export class LambdaClient {

  /**
   * アーカイブ検索Lambda関数を呼び出す
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  static async callArchiveSearchFunction(
    params: ArchiveSearchParams
  ): Promise<ArchiveSearchResult> {
    try {
      // Spring Cloud Functionのエンドポイント
      const response = await fetch(`${API_CONFIG.baseUrl}/archiveSearch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          error: errorData.error || 'アーカイブ検索中にエラーが発生しました',
          statusCode: response.status,
        } as ApiError;
      }

      return response.json();
    } catch (error) {
      console.error('アーカイブ検索関数呼び出しエラー:', error);
      throw error;
    }
  }
}