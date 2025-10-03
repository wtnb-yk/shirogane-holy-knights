import { GridColumnConfig } from '@/features/archives/types/specialGridTypes';

/**
 * 楽曲グリッドの列設定
 */
const SONG_GRID_COLUMNS: GridColumnConfig = {
  sm: 2,    // モバイル: 2列
  md: 4,    // タブレット: 3列
  lg: 4,    // デスクトップ小: 4列
  xl: 4     // デスクトップ大: 4列
};

/**
 * 楽曲グリッドの列設定を取得
 */
export function getSongGridColumns(): GridColumnConfig {
  return SONG_GRID_COLUMNS;
}

/**
 * デフォルトの空状態メッセージ
 */
export const DEFAULT_EMPTY_MESSAGE = {
  title: '楽曲が見つかりませんでした',
  subtitle: '検索条件を変更してお試しください'
};

/**
 * デフォルトのスケルトン表示数
 */
export const DEFAULT_SKELETON_COUNT = 8;
