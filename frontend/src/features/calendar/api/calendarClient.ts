import {
  CalendarSearchParamsDto,
  CalendarSearchResultDto,
  CalendarApiError,
  EventTypeDto
} from '../types';

/**
 * Calendar API のエンドポイント設定
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
};

/**
 * カレンダーAPIクライアント
 * Spring Boot APIを呼び出すためのクライアント
 */
export class CalendarClient {

  /**
   * カレンダー検索APIを呼び出す
   * @param params 検索パラメータ
   * @returns 検索結果
   */
  static async searchCalendar(
    params: CalendarSearchParamsDto = {}
  ): Promise<CalendarSearchResultDto> {
    const requestParams = {
      query: params.query,
      eventTypeIds: params.eventTypeIds,
      startDate: params.startDate,
      endDate: params.endDate,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };

    const response = await fetch(`${API_CONFIG.baseUrl}/calendar/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestParams),
    });

    if (!response.ok) {
      throw {
        error: 'カレンダーの取得に失敗しました。',
        statusCode: response.status,
      } as CalendarApiError;
    }

    return response.json();
  }

  /**
   * イベントタイプ一覧を取得
   * @returns イベントタイプ一覧
   */
  static async getEventTypes(): Promise<EventTypeDto[]> {
    const response = await fetch(`${API_CONFIG.baseUrl}/calendar/event-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw {
        error: 'イベントタイプの取得に失敗しました。',
        statusCode: response.status,
      } as CalendarApiError;
    }

    return response.json();
  }
}