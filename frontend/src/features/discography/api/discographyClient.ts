import {
  AlbumSearchParamsDto,
  AlbumSearchResultDto
} from '../types/types';
import { apiClient } from '@/utils/apiClient';

/**
 * アルバムAPI
 * News実装パターンに完全準拠
 */
export const AlbumApi = {
  /**
   * アルバム検索
   */
  search: (params: AlbumSearchParamsDto = {}): Promise<AlbumSearchResultDto> => {
    const requestParams = {
      query: params.query,
      albumTypes: params.albumTypes,
      startDate: params.startDate,
      endDate: params.endDate,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };

    return apiClient.post<AlbumSearchResultDto>('/albums', requestParams);
  }
};

// 後方互換性のため既存のクラスも残す
export class DiscographyClient {
  static async searchAlbums(params: AlbumSearchParamsDto = {}): Promise<AlbumSearchResultDto> {
    return AlbumApi.search(params);
  }
}