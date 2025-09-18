import { VideoSearchParams, VideoSearchResult, StreamSearchParams, StreamSearchResult } from '../types/types';
import { apiClient } from '@/utils/apiClient';

/**
 * 動画検索API
 */
export const VideoApi = {
  /**
   * 動画検索
   */
  search: (params: VideoSearchParams): Promise<VideoSearchResult> => {
    return apiClient.post<VideoSearchResult>('/videos', params);
  }
};

/**
 * 配信検索API
 */
export const StreamApi = {
  /**
   * 配信検索
   */
  search: (params: StreamSearchParams): Promise<StreamSearchResult> => {
    return apiClient.post<StreamSearchResult>('/streams', params);
  }
};

// 後方互換性のため既存のクラスも残す
export class VideoClient {
  static async callVideoSearchFunction(params: VideoSearchParams): Promise<VideoSearchResult> {
    return VideoApi.search(params);
  }
}

export class StreamClient {
  static async callStreamSearchFunction(params: StreamSearchParams): Promise<StreamSearchResult> {
    return StreamApi.search(params);
  }
}
