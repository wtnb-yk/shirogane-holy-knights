/**
 * ニュースDTOの型定義
 */
export interface NewsDto {
  id: string;
  title: string;
  categories: NewsCategoryDto[];
  publishedAt: string;
  content?: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  // 後方互換性のため単一カテゴリ情報も保持
  categoryId?: number;
  categoryName?: string;
}

/**
 * ニュースカテゴリDTOの型定義
 */
export interface NewsCategoryDto {
  id: number;
  name: string;
  sortOrder: number;
}

/**
 * ニュース検索パラメータの型定義 (統合版：一覧取得と検索機能を統合)
 * Video実装パターンに合わせて統合
 */
export interface NewsSearchParamsDto {
  query?: string;
  categoryIds?: number[]; // 複数カテゴリ対応
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
  categoryIds?: number[]; // 複数カテゴリ対応
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