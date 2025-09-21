import {
  VideoSearchParams,
  VideoSearchResult,
  StreamSearchParams,
  StreamSearchResult,
  VideoTagDto, StreamTagDto
} from '../types/types';
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
  },

  /**
   * 動画タグ一覧を取得
   */
  getAllTags: (): Promise<VideoTagDto[]> => {
    return apiClient.get<VideoTagDto[]>('/video-tags');
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
  },

  /**
   * 配信タグ一覧を取得
   */
  getAllTags: (): Promise<StreamTagDto[]> => {
    return apiClient.get<StreamTagDto[]>('/stream-tags');
  }
};

