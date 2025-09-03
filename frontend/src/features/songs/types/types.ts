// 楽曲検索の並び替え項目
export enum SortBy {
  SING_COUNT = 'singCount',
  LATEST_SING_DATE = 'latestSingDate'
}

// 楽曲検索の並び替え順
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

// パフォーマンス種別
export enum PerformanceType {
  STREAM = 'STREAM',
  CONCERT = 'CONCERT'
}

// パフォーマンス情報
export interface Performance {
  videoId: string;
  videoTitle: string;
  performanceType: PerformanceType;
  url: string;
  startSeconds: number;
  performedAt: string;
  streamSongUrl: string;
}

// 楽曲情報
export interface StreamSong {
  id: string;
  title: string;
  artist: string;
  singCount: number;
  latestSingDate: string | null;
  performances: Performance[];
}

// 楽曲検索パラメータ
export interface StreamSongSearchParams {
  query?: string;
  searchTarget?: SearchTarget;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  startDate?: string;
  endDate?: string;
  frequencyCategories?: SingFrequencyCategory[];
  page?: number;
  size?: number;
}

// 楽曲検索結果
export interface StreamSongSearchResult {
  items: StreamSong[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// 上位楽曲統計
export interface TopSongStats {
  songId: string;
  title: string;
  artist: string;
  singCount: number;
}

// 最新歌唱統計
export interface RecentPerformanceStats {
  songId: string;
  title: string;
  artist: string;
  latestPerformance: string;
  latestVideoId: string;
  latestVideoTitle: string;
  latestVideoUrl: string;
}

// 楽曲統計情報
export interface StreamSongStats {
  totalSongs: number;
  totalPerformances: number;
  topSongs: TopSongStats[];
  recentPerformances: RecentPerformanceStats[];
}

// 検索対象
export enum SearchTarget {
  ALL = 'ALL',
  TITLE = 'TITLE', 
  ARTIST = 'ARTIST'
}

// 歌唱頻度カテゴリ
export enum SingFrequencyCategory {
  LOW = 'LOW',        // 1-2回
  MEDIUM = 'MEDIUM',  // 3-5回
  HIGH = 'HIGH',      // 6-10回
  VERY_HIGH = 'VERY_HIGH' // 11回以上
}

// フィルターオプション
export interface SongFilterOptions {
  startDate?: string;
  endDate?: string;
  frequencyCategories?: SingFrequencyCategory[];
}

// 表示モード
export enum ViewMode {
  GRID = 'grid',
  LIST = 'list'
}