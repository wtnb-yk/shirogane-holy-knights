/**
 * コンポーネント固有のProps型定義
 * 各機能領域で使用されるコンポーネントのProps型を集約
 */

import { BaseComponentProps, IndexedComponentProps, FilterSectionProps, StatsSummaryProps } from './common';
import { ContentType, VideoDto, StreamDto } from '@/features/archives/types/types';
import { NewsDto, NewsFilterOptions } from '@/features/news/types/types';
import { Event, CalendarFilterOptions } from '@/features/calendar/types';
import { StreamSong, SongFilterOptions } from '@/features/songs/types/types';

// ===== カード系コンポーネント =====

/**
 * 動画カード共通Props
 */
export interface VideoCardProps extends IndexedComponentProps {
  video: VideoDto;
  variant?: 'default' | 'featured' | 'pickup';
}

/**
 * 配信カード共通Props
 */
export interface StreamCardProps extends IndexedComponentProps {
  stream: StreamDto;
  variant?: 'default' | 'featured' | 'pickup';
}

/**
 * ニュースカード共通Props
 */
export interface NewsCardProps extends IndexedComponentProps {
  news: NewsDto;
  variant?: 'default' | 'compact';
}

/**
 * 楽曲カード共通Props
 */
export interface SongCardProps extends IndexedComponentProps {
  song: StreamSong;
  variant?: 'default' | 'compact';
}

/**
 * イベントカード共通Props
 */
export interface EventCardProps extends IndexedComponentProps {
  event: Event;
  variant?: 'default' | 'compact';
}

// ===== グリッド系コンポーネント =====

/**
 * 動画グリッド共通Props
 */
export interface VideoGridProps extends BaseComponentProps {
  videos: VideoDto[];
  loading: boolean;
  variant?: 'default' | 'special';
}

/**
 * 配信グリッド共通Props
 */
export interface StreamGridProps extends BaseComponentProps {
  streams: StreamDto[];
  loading: boolean;
  variant?: 'default' | 'special';
}

/**
 * ニュースグリッド共通Props
 */
export interface NewsGridProps extends BaseComponentProps {
  news: NewsDto[];
  loading: boolean;
  variant?: 'grid' | 'list';
}

// ===== スケルトン系コンポーネント =====

/**
 * スケルトンカード共通Props
 */
export interface SkeletonCardProps extends IndexedComponentProps {
  variant?: 'video' | 'news' | 'song' | 'event';
  showThumbnail?: boolean;
}

// ===== サイドバー系コンポーネント =====

/**
 * 検索セクション共通Props
 */
export interface SearchSectionProps extends BaseComponentProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOptionsClick?: () => void;
  hasActiveOptions?: boolean;
  title?: string;
  placeholder?: string;
}

/**
 * カテゴリフィルター共通Props
 */
export interface CategoryFilterProps extends BaseComponentProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
  variant?: 'buttons' | 'badges';
}

/**
 * タグフィルター共通Props
 */
export interface TagFilterProps extends BaseComponentProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll?: () => void;
  variant?: 'badges' | 'buttons';
}

/**
 * 日付範囲フィルター共通Props
 */
export interface DateRangeFilterProps extends BaseComponentProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (field: 'startDate' | 'endDate', value: string) => void;
  variant?: 'default' | 'mobile';
}

// ===== フィルター系コンポーネント =====

/**
 * アーカイブフィルター Props
 */
export interface ArchiveFilterProps extends FilterSectionProps<any> {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  availableTags?: string[];
}

/**
 * ニュースフィルター Props
 */
export interface NewsFilterProps extends FilterSectionProps<NewsFilterOptions> {
  availableCategories?: Array<{ id: number; name: string }>;
}

/**
 * 楽曲フィルター Props
 */
export interface SongFilterProps extends FilterSectionProps<SongFilterOptions> {
  availableFrequencyCategories?: string[];
}

/**
 * カレンダーフィルター Props
 */
export interface CalendarFilterProps extends FilterSectionProps<CalendarFilterOptions> {
  availableEventTypes?: Array<{ id: number; type: string }>;
}

// ===== 結果表示系コンポーネント =====

/**
 * 検索結果サマリー共通Props
 */
export interface SearchResultsSummaryProps extends BaseComponentProps {
  searchQuery: string;
  totalCount: number;
  filterSummary?: string;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
}

/**
 * 統計サマリー共通Props（拡張版）
 */
export interface ExtendedStatsSummaryProps extends StatsSummaryProps {
  itemType: 'videos' | 'streams' | 'news' | 'songs' | 'events';
  showDetails?: boolean;
}

// ===== モーダル/ボトムシート系コンポーネント =====

/**
 * 検索オプションモーダル共通Props
 */
export interface SearchOptionsModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * ボトムシートコンテンツ共通Props
 */
export interface BottomSheetContentProps extends BaseComponentProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// ===== ナビゲーション系コンポーネント =====

/**
 * ナビゲーションアイテム Props
 */
export interface NavigationItemProps extends BaseComponentProps {
  href: string;
  label: string;
  isActive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * ナビゲーションメニュー Props
 */
export interface NavigationMenuProps extends BaseComponentProps {
  items: Array<{
    href: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  currentPath?: string;
}

// ===== レイアウト系コンポーネント =====

/**
 * ページレイアウト Props
 */
export interface PageLayoutProps extends BaseComponentProps {
  title: string;
  description: React.ReactNode;
  sidebar?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * ページタイトル Props
 */
export interface PageTitleProps extends BaseComponentProps {
  title: string;
  description?: string | React.ReactNode;
  actions?: React.ReactNode;
}

// ===== SEO系コンポーネント =====

/**
 * JSON-LD Props
 */
export interface JsonLdProps {
  data: Record<string, any>;
  type?: 'WebSite' | 'Article' | 'Event' | 'MusicRecording';
}

/**
 * パンくずリスト Props
 */
export interface BreadcrumbProps extends BaseComponentProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}