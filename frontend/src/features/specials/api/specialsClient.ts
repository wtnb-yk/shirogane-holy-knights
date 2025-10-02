import {
  SpecialEventDto,
  SpecialEventSearchParamsDto,
  SpecialEventSearchResultDto
} from '../types/types';
import { apiClient } from '@/utils/apiClient';

/**
 * スペシャルイベントAPI
 * ディスコグラフィー実装パターンに完全準拠
 */
export const SpecialsApi = {
  /**
   * スペシャルイベント一覧を取得
   */
  getSpecialEvents: (params: SpecialEventSearchParamsDto = {}): Promise<SpecialEventSearchResultDto> => {
    const requestParams = {
      query: params.query,
      status: params.status,
      startDate: params.startDate,
      endDate: params.endDate,
    };

    return apiClient.post<SpecialEventSearchResultDto>('/specials', requestParams);
  },

  /**
   * 個別スペシャルイベント詳細を取得
   */
  getSpecialEventDetails: (eventId: string): Promise<SpecialEventDto> => {
    return apiClient.get<SpecialEventDto>(`/specials/${eventId}`);
  }
};