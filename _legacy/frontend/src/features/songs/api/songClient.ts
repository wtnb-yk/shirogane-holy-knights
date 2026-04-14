import {
  StreamSongSearchParams,
  StreamSongSearchResult,
  ConcertSongSearchParams,
  ConcertSongSearchResult,
} from '../types/types';
import { apiClient } from '@/utils/apiClient';

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
    return await apiClient.post<StreamSongSearchResult>('/stream-songs', params);
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
    return await apiClient.post<ConcertSongSearchResult>('/concert-songs', params);
  }
}
