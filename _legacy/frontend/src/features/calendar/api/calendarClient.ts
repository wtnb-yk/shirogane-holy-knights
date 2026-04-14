import {
  CalendarSearchParamsDto,
  CalendarSearchResultDto,
  EventTypeDto
} from '../types';
import { apiClient } from '@/utils/apiClient';

/**
 * カレンダーAPI
 */
export const CalendarApi = {
  /**
   * カレンダー検索
   */
  search: (params: CalendarSearchParamsDto = {}): Promise<CalendarSearchResultDto> => {
    const requestParams = {
      query: params.query,
      eventTypeIds: params.eventTypeIds,
      startDate: params.startDate,
      endDate: params.endDate,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };

    return apiClient.post<CalendarSearchResultDto>('/calendar/events', requestParams);
  },

  /**
   * イベントタイプ一覧を取得
   */
  getEventTypes: (): Promise<EventTypeDto[]> => {
    return apiClient.get<EventTypeDto[]>('/calendar/event-types');
  }
};

