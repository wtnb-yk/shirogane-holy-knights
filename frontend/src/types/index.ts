/**
 * 型定義のメインエクスポートファイル
 * 全ての型定義を統一的にエクスポート
 */

// 共通型定義
export * from './common';

// UI関連型定義
export * from './ui';

// コンポーネント関連型定義
export * from './components';

// 機能別型定義の再エクスポート（名前の衝突を避けるため個別エクスポート）
export type { 
  ContentType, 
  VideoDto, 
  StreamDto, 
  VideoSearchParams, 
  VideoSearchResult, 
  StreamSearchParams, 
  StreamSearchResult 
} from '@/features/archives/types/types';

export type { 
  NewsDto, 
  NewsCategoryDto, 
  NewsSearchParamsDto, 
  NewsSearchResultDto, 
  NewsFilterOptions,
  NewsApiError
} from '@/features/news/types/types';

export type { 
  Event, 
  EventType, 
  CalendarView, 
  CalendarState, 
  EventDto, 
  EventTypeDto, 
  CalendarSearchParamsDto, 
  CalendarSearchResultDto, 
  CalendarApiError, 
  CalendarFilterOptions 
} from '@/features/calendar/types';

export type { 
  SortBy, 
  SortOrder, 
  PerformanceType, 
  Performance, 
  StreamSong, 
  StreamSongSearchParams, 
  StreamSongSearchResult, 
  TopSongStats, 
  RecentPerformanceStats, 
  StreamSongStats, 
  SearchTarget, 
  SingFrequencyCategory, 
  SongFilterOptions, 
  SongContentType, 
  ConcertSong, 
  ConcertSongSearchParams, 
  ConcertSongSearchResult, 
  ConcertSongStats 
} from '@/features/songs/types/types';