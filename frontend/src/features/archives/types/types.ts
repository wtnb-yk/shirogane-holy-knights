/**
 * アーカイブDTOの型定義
 */
export interface ArchiveDto {
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
 * アーカイブ検索パラメータの型定義
 */
export interface ArchiveSearchParams {
  query?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

/**
 * アーカイブ検索結果の型定義
 */
export interface ArchiveSearchResult {
  items: ArchiveDto[];
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