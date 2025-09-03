/**
 * 特別表示アイテムの種類
 */
export type SpecialItemType = 'featured' | 'pickup';

/**
 * 特別表示アイテムの設定
 */
export interface SpecialItemConfig {
  /** アイテムの種類 */
  type: SpecialItemType;
  /** データのインデックス位置 */
  dataIndex: number;
  /** グリッド上での配置情報 */
  gridPlacement: {
    /** 占有する列数 */
    colSpan: number;
    /** 占有する行数 */
    rowSpan: number;
  };
}

/**
 * 特別表示レイアウトの設定
 */
export interface SpecialGridLayout {
  /** 特別表示を適用するアイテムの配列 */
  specialItems: SpecialItemConfig[];
  /** スキップするデータインデックスの配列（自動計算） */
  skipIndices: number[];
}

/**
 * グリッドカラム設定
 */
export interface GridColumnConfig {
  /** レスポンシブブレークポイントごとの列数 */
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

/**
 * 特別表示グリッドの props
 */
export interface SpecialGridProps<T> {
  /** 表示するアイテムの配列 */
  items: T[];
  /** ローディング状態 */
  loading: boolean;
  /** エラーメッセージ */
  error?: string | null;
  /** 特別表示を有効にするかどうか */
  enableSpecialLayout: boolean;
  /** 特別表示レイアウト設定 */
  specialLayout: SpecialGridLayout;
  /** グリッドの列数設定 */
  gridColumns: GridColumnConfig;
  /** 通常アイテムのレンダラー */
  renderNormalItem: (item: T, index: number) => React.ReactNode;
  /** 特別アイテムのレンダラー */
  renderSpecialItem: (item: T, index: number, type: SpecialItemType) => React.ReactNode;
  /** スケルトンのレンダラー */
  renderSkeleton: (index: number) => React.ReactNode;
  /** 空状態のメッセージ */
  emptyMessage: {
    title: string;
    subtitle: string;
  };
  /** スケルトン表示数 */
  skeletonCount?: number;
}

/**
 * カードコンポーネントの基底 props
 */
export interface BaseCardProps {
  index: number;
}

/**
 * 動画カード用 props
 */
export interface VideoCardProps extends BaseCardProps {
  video: import('./types').VideoDto;
}

/**
 * 配信カード用 props  
 */
export interface StreamCardProps extends BaseCardProps {
  stream: import('./types').StreamDto;
}