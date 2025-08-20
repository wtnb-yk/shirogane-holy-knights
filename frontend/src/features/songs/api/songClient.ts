import {
  PerformedSongSearchParams,
  PerformedSongSearchResult,
  PerformedSongStats
} from '../types/types';

/**
 * API設定
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
};

/**
 * 楽曲API関連のエラー型
 */
export interface ApiError {
  error: string;
  statusCode: number;
}

/**
 * 楽曲検索クライアント
 * Spring Cloud Functionで実装されたLambda関数を呼び出すためのクライアント
 */
export class SongClient {

  /**
   * 楽曲検索Lambda関数を呼び出す
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  static async callPerformedSongsSearchFunction(
    params: PerformedSongSearchParams
  ): Promise<PerformedSongSearchResult> {
    const response = await fetch(`${API_CONFIG.baseUrl}/performed-songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        error: errorData.error || '楽曲検索中にエラーが発生しました',
        statusCode: response.status,
      } as ApiError;
    }

    return response.json();
  }

  /**
   * 楽曲統計情報Lambda関数を呼び出す
   * @returns 統計情報
   */
  static async callPerformedSongsStatsFunction(): Promise<PerformedSongStats> {
    const response = await fetch(`${API_CONFIG.baseUrl}/performed-songs/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        error: errorData.error || '楽曲統計情報取得中にエラーが発生しました',
        statusCode: response.status,
      } as ApiError;
    }

    return response.json();
  }
}
