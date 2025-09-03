import { 
  SpecialItemConfig, 
  SpecialGridLayout, 
  GridColumnConfig 
} from '../types/specialGridTypes';
import { createSpecialGridLayout } from '../utils/gridLayoutCalculator';

/**
 * 動画グリッドの特別表示設定
 */
const VIDEO_SPECIAL_ITEMS: SpecialItemConfig[] = [
  {
    type: 'featured',
    dataIndex: 0, // 最新動画（1番目）
    gridPlacement: {
      colSpan: 2,
      rowSpan: 2
    }
  },
  {
    type: 'pickup', 
    dataIndex: 8, // PICKUP動画（9番目、LATEST占有考慮後の実際位置）
    gridPlacement: {
      colSpan: 2,
      rowSpan: 2  
    }
  }
];

/**
 * 配信グリッドの特別表示設定
 */
const STREAM_SPECIAL_ITEMS: SpecialItemConfig[] = [
  {
    type: 'featured',
    dataIndex: 0, // 最新配信（1番目）
    gridPlacement: {
      colSpan: 2,
      rowSpan: 2
    }
  },
  {
    type: 'pickup',
    dataIndex: 8, // PICKUP配信（9番目、LATEST占有考慮後の実際位置）
    gridPlacement: {
      colSpan: 2,
      rowSpan: 2
    }
  }
];

/**
 * 動画グリッドの列設定
 */
const VIDEO_GRID_COLUMNS: GridColumnConfig = {
  sm: 1,    // モバイル: 1列
  md: 2,    // タブレット: 2列  
  lg: 3,    // デスクトップ小: 3列
  xl: 4     // デスクトップ大: 4列
};

/**
 * 配信グリッドの列設定
 */
const STREAM_GRID_COLUMNS: GridColumnConfig = {
  sm: 2,    // モバイル: 2列
  md: 3,    // タブレット: 3列
  lg: 4,    // デスクトップ: 4列
  xl: 4     // デスクトップ大: 4列
};

/**
 * 動画グリッドの特別レイアウト設定を取得
 */
export function getVideoSpecialLayout(): SpecialGridLayout {
  return createSpecialGridLayout(VIDEO_SPECIAL_ITEMS);
}

/**
 * 配信グリッドの特別レイアウト設定を取得
 */
export function getStreamSpecialLayout(): SpecialGridLayout {
  return createSpecialGridLayout(STREAM_SPECIAL_ITEMS);
}

/**
 * 動画グリッドの列設定を取得
 */
export function getVideoGridColumns(): GridColumnConfig {
  return VIDEO_GRID_COLUMNS;
}

/**
 * 配信グリッドの列設定を取得
 */
export function getStreamGridColumns(): GridColumnConfig {
  return STREAM_GRID_COLUMNS;
}

/**
 * デフォルトの空状態メッセージ
 */
export const DEFAULT_EMPTY_MESSAGE = {
  videos: {
    title: '動画が見つかりませんでした',
    subtitle: '検索条件を変更してお試しください'
  },
  streams: {
    title: '配信が見つかりませんでした', 
    subtitle: '検索条件を変更してお試しください'
  }
};

/**
 * デフォルトのスケルトン表示数
 */
export const DEFAULT_SKELETON_COUNT = 8;