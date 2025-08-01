/**
 * 動画DTOの型定義
 */
export interface VideoDto {
  id: string;
  title: string;
  channelId: string;
  url: string;
  publishedAt: string;
  description?: string;
  tags: string[];
  duration?: string;
  thumbnailUrl?: string;
  isMembersOnly?: boolean;
}

/**
 * 動画検索パラメータの型定義
 */
export interface VideoSearchParams {
  query?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

/**
 * 動画検索結果の型定義
 */
export interface VideoSearchResult {
  items: VideoDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Lambda関数レスポンス用のエラー型定義
 */
export interface ApiError {
  error: string;
  statusCode?: number;
}