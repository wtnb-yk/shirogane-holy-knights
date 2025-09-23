/**
 * 日付を日本語ロケールでフォーマットする
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ja-JP');
};