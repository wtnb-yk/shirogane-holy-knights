/**
 * グリッド列設定の型定義
 */
interface GridColumnConfig {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

/**
 * スペシャルイベントグリッドの列設定
 */
const SPECIAL_EVENT_GRID_COLUMNS: GridColumnConfig = {
  sm: 1,    // モバイル: 1列
  md: 2,    // タブレット: 2列
  lg: 3,    // デスクトップ: 3列
};

/**
 * スペシャルイベントグリッドの列設定を取得
 */
export function getSpecialEventGridColumns(): GridColumnConfig {
  return SPECIAL_EVENT_GRID_COLUMNS;
}

/**
 * デフォルトの空状態メッセージ
 */
export const DEFAULT_EMPTY_MESSAGE = {
  title: '現在開催中のスペシャルイベントはありません。',
  subtitle: ''
};

/**
 * デフォルトのスケルトン表示数
 */
export const DEFAULT_SKELETON_COUNT = 6;
