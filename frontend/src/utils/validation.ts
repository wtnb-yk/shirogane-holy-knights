/**
 * バリデーション関連のユーティリティ関数
 */

/**
 * メールアドレスの形式をチェック
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 日付文字列が有効かチェック
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * 日付範囲が有効かチェック
 */
export const isValidDateRange = (startDate?: string, endDate?: string): boolean => {
  if (!startDate || !endDate) return true; // 片方だけでもOK
  
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  
  return new Date(startDate) <= new Date(endDate);
};

/**
 * 文字列が空でないかチェック
 */
export const isNotEmpty = (value: string | null | undefined): value is string => {
  return value != null && value.trim().length > 0;
};

/**
 * 数値が指定した範囲内かチェック
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 配列が空でないかチェック
 */
export const isNotEmptyArray = <T>(array: T[] | null | undefined): array is T[] => {
  return Array.isArray(array) && array.length > 0;
};

/**
 * オブジェクトが空でないかチェック
 */
export const isNotEmptyObject = (obj: object | null | undefined): boolean => {
  return obj != null && Object.keys(obj).length > 0;
};

/**
 * 文字列の長さが指定した範囲内かチェック
 */
export const isValidLength = (value: string, minLength: number, maxLength: number): boolean => {
  const length = value.trim().length;
  return length >= minLength && length <= maxLength;
};

/**
 * ページ番号が有効かチェック
 */
export const isValidPageNumber = (page: number, totalPages: number): boolean => {
  return Number.isInteger(page) && page >= 1 && page <= totalPages;
};

/**
 * ページサイズが有効かチェック
 */
export const isValidPageSize = (pageSize: number, allowedSizes: number[] = [10, 20, 50, 100]): boolean => {
  return allowedSizes.includes(pageSize);
};

/**
 * 検索クエリが有効かチェック
 */
export const isValidSearchQuery = (query: string, minLength: number = 1, maxLength: number = 100): boolean => {
  if (!isNotEmpty(query)) return false;
  return isValidLength(query, minLength, maxLength);
};

/**
 * IDが有効かチェック（数値または文字列）
 */
export const isValidId = (id: string | number): boolean => {
  if (typeof id === 'number') {
    return Number.isInteger(id) && id > 0;
  }
  return isNotEmpty(id) && id.trim().length > 0;
};

/**
 * ソート方向が有効かチェック
 */
export const isValidSortDirection = (direction: string): direction is 'ASC' | 'DESC' => {
  return direction === 'ASC' || direction === 'DESC';
};

/**
 * カラーコードが有効かチェック（HEX形式）
 */
export const isValidHexColor = (color: string): boolean => {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
};
