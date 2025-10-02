/**
 * スペシャルイベントDTOの型定義
 */
export interface SpecialEventDto {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended';
}

/**
 * スペシャルイベント検索パラメータの型定義
 * 将来の拡張に備えて定義
 */
export interface SpecialEventSearchParamsDto {
  query?: string;
  status?: ('upcoming' | 'active' | 'ended')[];
  startDate?: string;
  endDate?: string;
}

/**
 * スペシャルイベント検索結果の型定義
 */
export interface SpecialEventSearchResultDto {
  items: SpecialEventDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Lambda関数レスポンス用のエラー型定義
 */
export interface SpecialEventApiError {
  error: string;
  statusCode?: number;
}