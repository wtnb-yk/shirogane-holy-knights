/**
 * 共通型定義ファイル
 * アプリケーション全体で使用される共通の型定義を集約
 */

// ===== 基本的な共通型 =====

/**
 * ページネーション情報
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}

/**
 * API エラーレスポンス
 */
export interface ApiError {
  error: string;
  statusCode?: number;
}

/**
 * 検索結果の基本構造
 */
export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 日付範囲フィルター
 */
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

/**
 * 基本的な検索パラメータ
 */
export interface BaseSearchParams extends DateRangeFilter {
  query?: string;
  page?: number;
  pageSize?: number;
}

// ===== コンポーネント共通Props =====

/**
 * 基本的なコンポーネントProps
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * インデックス付きコンポーネントProps（アニメーション用）
 */
export interface IndexedComponentProps extends BaseComponentProps {
  index: number;
}

/**
 * 検索入力コンポーネントProps
 */
export interface SearchInputProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'sidebar' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 日付入力コンポーネントProps
 */
export interface DateInputProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'sidebar' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
}

/**
 * 日付範囲入力コンポーネントProps
 */
export interface DateRangeInputProps extends DateRangeFilter {
  onDateChange: (field: 'startDate' | 'endDate', value: string) => void;
  startLabel?: string;
  endLabel?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'sidebar' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * セクション付き日付範囲コンポーネントProps
 */
export interface DateRangeSectionProps extends DateRangeInputProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

/**
 * ページネーションコンポーネントProps
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
  animationDelay?: string;
  className?: string;
  totalCount?: number;
  pageSize?: number;
}

/**
 * モーダル/ボトムシート共通Props
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
}

/**
 * カード型コンポーネント共通Props
 */
export interface CardProps extends IndexedComponentProps {
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * フィルターセクション共通Props
 */
export interface FilterSectionProps<T = any> extends BaseComponentProps {
  filters: T;
  onFiltersChange: (filters: T) => void;
}

/**
 * 統計表示コンポーネントProps
 */
export interface StatsSummaryProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  loading?: boolean;
  animationDelay?: string;
  className?: string;
}

// ===== ユーティリティ型 =====

/**
 * オプショナルなフィールドを持つ型を作成
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 必須フィールドを持つ型を作成
 */
export type RequiredFields<T, K extends keyof T> = T & globalThis.Required<Pick<T, K>>;

/**
 * ID付きエンティティの基本型
 */
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * ソート設定
 */
export interface SortConfig {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * ローディング状態を持つデータ
 */
export interface LoadingState<T> {
  data: T;
  loading: boolean;
  error?: string;
}

// ===== フック関連型 =====

/**
 * データフェッチフックの戻り値型
 */
export interface UseDataResult<T> extends LoadingState<T> {
  refetch: () => void;
  hasMore?: boolean;
}

/**
 * ページネーション付きデータフェッチフックの戻り値型
 */
export interface UsePaginatedDataResult<T> extends UseDataResult<T[]> {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * フィルター付きデータフェッチフックの戻り値型
 */
export interface UseFilteredDataResult<T, F> extends UsePaginatedDataResult<T> {
  filters: F;
  updateFilters: (filters: Partial<F>) => void;
  resetFilters: () => void;
}