import {
  NewsSearchParamsDto,
  NewsSearchResultDto,
  NewsCategoryDto
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
  },

  /**
   * ニュースカテゴリ一覧を取得
   */
  getCategories: (): Promise<NewsCategoryDto[]> => {
    return apiClient.get<NewsCategoryDto[]>('/news/categories');
  }
};

