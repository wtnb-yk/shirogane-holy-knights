/**
 * ニュースDTOの型定義
 */
export interface NewsDto {
  id: string;
  title: string;
  categoryId: number;
  categoryName: string;
  categoryDisplayName: string;
  publishedAt: string;
  content?: string;
  summary?: string;
  thumbnailUrl?: string;
  externalUrl?: string;
}

/**
 * ニュースカテゴリDTOの型定義
 */
export interface NewsCategoryDto {
  id: number;
  name: string;
  displayName: string;
  description: string;
  sortOrder: number;
}

/**
 * ニュース検索パラメータの型定義 (統合版：一覧取得と検索機能を統合)
 * Video実装パターンに合わせて統合
 */
export interface NewsSearchParamsDto {
  query?: string;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

/**
 * ニュース検索結果の型定義
 */
export interface NewsSearchResultDto {
  items: NewsDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}


/**
 * フィルターオプションの型定義
 */
export interface NewsFilterOptions {
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Lambda関数レスポンス用のエラー型定義
 */
export interface NewsApiError {
  error: string;
  statusCode?: number;
}