import {
  SpecialEventDetailDto,
  SpecialEventSearchResultDto
} from '../types/types';
import { apiClient } from '@/utils/apiClient';

/**
 * スペシャルイベントAPI
 * ディスコグラフィー実装パターンに完全準拠
 */
export const SpecialApi = {
  /**
   * スペシャルイベント一覧を取得
   */
  getSpecialEvents: (): Promise<SpecialEventSearchResultDto> => {
    return apiClient.get<SpecialEventSearchResultDto>('/specials');
  },

  /**
   * 個別スペシャルイベント詳細を取得
   */
  getSpecialEventDetails: (eventId: string): Promise<SpecialEventDetailDto> => {
    return apiClient.get<SpecialEventDetailDto>(`/specials/${eventId}`);
  }
};
