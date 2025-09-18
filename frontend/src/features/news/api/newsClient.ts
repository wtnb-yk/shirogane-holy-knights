import {
  NewsSearchParamsDto,
  NewsSearchResultDto
} from '../types/types';
import { apiClient } from '@/utils/apiClient';

/**
 * ニュースAPI
 */
export const NewsApi = {
  /**
   * ニュース検索
   */
  search: (params: NewsSearchParamsDto = {}): Promise<NewsSearchResultDto> => {
    const requestParams = {
      query: params.query,
      categoryIds: params.categoryIds,
      startDate: params.startDate,
      endDate: params.endDate,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };

    return apiClient.post<NewsSearchResultDto>('/news', requestParams);
  }
};

// 後方互換性のため既存のクラスも残す
export class NewsClient {
  static async searchNews(params: NewsSearchParamsDto = {}): Promise<NewsSearchResultDto> {
    return NewsApi.search(params);
  }
}
