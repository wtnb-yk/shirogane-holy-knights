import {
  AlbumSearchParamsDto,
  AlbumSearchResultDto,
  AlbumTypeDto
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
  },

  /**
   * カテゴリ一覧を取得
   */
  getTypes: (): Promise<AlbumTypeDto[]> => {
    return apiClient.get<AlbumTypeDto[]>('/albums/types');
  }
};

