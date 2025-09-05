import {
  StreamSongSearchParams,
  StreamSongSearchResult,
  StreamSongStats,
  ConcertSongSearchParams,
  ConcertSongSearchResult,
  ConcertSongStats
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
  static async callStreamSongsSearchFunction(
    params: StreamSongSearchParams
  ): Promise<StreamSongSearchResult> {
    const response = await fetch(`${API_CONFIG.baseUrl}/stream-songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw {
        error: '楽曲検索中にエラーが発生しました。',
        statusCode: response.status,
      } as ApiError;
    }

    return response.json();
  }

  /**
   * 楽曲統計情報Lambda関数を呼び出す
   * @returns 統計情報
   */
  static async callStreamSongsStatsFunction(): Promise<StreamSongStats> {
    const response = await fetch(`${API_CONFIG.baseUrl}/stream-songs/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw {
        error: '楽曲統計情報取得中にエラーが発生しました。',
        statusCode: response.status,
      } as ApiError;
    }

    return response.json();
  }
}

/**
 * コンサート楽曲検索クライアント
 * Spring Cloud Functionで実装されたLambda関数を呼び出すためのクライアント
 */
export class ConcertSongClient {

  /**
   * コンサート楽曲検索Lambda関数を呼び出す
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  static async callConcertSongsSearchFunction(
    params: ConcertSongSearchParams
  ): Promise<ConcertSongSearchResult> {
    const response = await fetch(`${API_CONFIG.baseUrl}/concert-songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw {
        error: 'コンサート楽曲検索中にエラーが発生しました。',
        statusCode: response.status,
      } as ApiError;
    }

    return response.json();
  }

  /**
   * コンサート楽曲統計情報Lambda関数を呼び出す
   * @returns 統計情報
   */
  static async callConcertSongsStatsFunction(): Promise<ConcertSongStats> {
    const response = await fetch(`${API_CONFIG.baseUrl}/concert-songs/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw {
        error: 'コンサート楽曲統計情報取得中にエラーが発生しました。',
        statusCode: response.status,
      } as ApiError;
    }

    return response.json();
  }
}
