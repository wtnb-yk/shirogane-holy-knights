import {VideoSearchParams, VideoSearchResult, StreamSearchParams, StreamSearchResult, ApiError} from '../types/types';

/**
 * Lambda関数のエンドポイント設定
 */
const API_CONFIG = {
  // 環境変数から取得するか、デフォルトとしてlocalhostを使用
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
};

/**
 * Lambda関数クライアント
 * Spring Cloud Functionで実装されたLambda関数を呼び出すためのクライアント
 */
export class VideoClient {

  /**
   * 動画検索Lambda関数を呼び出す
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  static async callVideoSearchFunction(
    params: VideoSearchParams
  ): Promise<VideoSearchResult> {
    // Spring Cloud Functionのエンドポイント
    const response = await fetch(`${API_CONFIG.baseUrl}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        error: errorData.error || '動画検索中にエラーが発生しました',
        statusCode: response.status,
      } as ApiError;
    }

    return response.json();
  }
}

/**
 * 配信Lambda関数クライアント
 * Spring Cloud Functionで実装された配信Lambda関数を呼び出すためのクライアント
 */
export class StreamClient {

  /**
   * 配信検索Lambda関数を呼び出す
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  static async callStreamSearchFunction(
    params: StreamSearchParams
  ): Promise<StreamSearchResult> {
    // Spring Cloud Functionのエンドポイント
    const response = await fetch(`${API_CONFIG.baseUrl}/streams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        error: errorData.error || '配信検索中にエラーが発生しました',
        statusCode: response.status,
      } as ApiError;
    }

    return response.json();
  }
}
