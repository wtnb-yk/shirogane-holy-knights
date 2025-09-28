/**
 * コンポーネントのメインエクスポートファイル
 * 機能別に分類された21カテゴリのコンポーネントを統一的にエクスポート
 */

// Button - ボタン系コンポーネント
export { Button } from './Button/Button';
export { SearchOptionsButton } from './Button/SearchOptionsButton';
export { ModalButton } from './Button/ModalButton';
export { FilterToggleButton } from './Button/FilterToggleButton';

// Input - 入力系コンポーネント
export { SearchInput } from './Input/SearchInput';
export { DateInput } from './Input/DateInput';
export { DateRangeSection } from './Input/DateRangeSection';
export { DateRangeInput } from './Input/DateRangeInput';
export { SegmentedControl } from './Input/SegmentedControl';

// Select - 選択系コンポーネント
export { Select } from './Select/Select';
export { MultiSelect } from './Select/MultiSelect';
export { MultiSelectSection } from './Select/MultiSelectSection';

// Card - カード表示コンポーネント
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card/card';
export { InteractiveCard } from './Card/InteractiveCard';
export { StaggeredItem } from './Card/StaggeredItem';

// Modal - モーダル・ダイアログコンポーネント
export { Modal } from './Modal/Modal';
export { ResponsiveModal } from './Modal/ResponsiveModal';
export { ModalHeader } from './Modal/ModalHeader';
export { SearchOptionsModal } from './Modal/SearchOptionsModal';

// Overlay - オーバーレイコンポーネント
export { Overlay } from './Overlay/Overlay';
export { OverlayIcon } from './Overlay/OverlayIcon';

// List - リスト表示コンポーネント
export { SelectableList } from './List/SelectableList';
export { SelectableListHeader } from './List/SelectableListHeader';
export { SelectableListItem } from './List/SelectableListItem';

// Layout - レイアウトコンポーネント
export { PageLayout } from './Layout/PageLayout';
export { PageTitle } from './Layout/PageTitle';
export { BaseGrid } from './Layout/BaseGrid';

// Navigation - ナビゲーションコンポーネント
export { Pagination } from './Navigation/Pagination';
export { LinkText } from './Navigation/LinkText';

// Badge - バッジ表示コンポーネント
export { Badge, badgeVariants } from './Badge/badge';

// Image - 画像表示コンポーネント
export { OptimizedImage } from './Image/OptimizedImage';

// Loading - ローディングコンポーネント
export { LoadingState, PageLoadingState, InlineLoadingState, CardLoadingState } from './Loading/LoadingState';
export { BaseSkeleton } from './Loading/BaseSkeleton';
export { Skeleton } from './Loading/skeleton';

// Error - エラー処理コンポーネント
export { ErrorDisplay } from './Error/ErrorDisplay';
export { ErrorBoundary } from './Error/ErrorBoundary';

// Feedback - フィードバックコンポーネント
export { ToastProvider, useToast } from './Feedback/Toast';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Feedback/tooltip';
export { OfflineIndicator } from './Feedback/OfflineIndicator';

// Stats - 統計表示コンポーネント
export { StatsSummary } from './Stats/StatsSummary';
export { SearchResultsSummary } from './Stats/SearchResultsSummary';

// Section - セクションコンポーネント
export { YearPresetsSection } from './Section/YearPresetsSection';
export { EventTypePresetsSection } from './Section/EventTypePresetsSection';
export { DatePresetsSection } from './Section/DatePresetsSection';
export { BottomSheetSectionHeader } from './Section/BottomSheetSectionHeader';

// Misc - その他のコンポーネント
export { DynamicSearchOptionsModal, DynamicBottomSheet, DynamicYouTubePlayer } from './Misc/DynamicComponents';
export { FloatingYouTubeLink } from './Misc/FloatingYouTubeLink';

// 保持されたディレクトリ - 既存構造維持
export { BottomSheet } from './BottomSheet/BottomSheet';
export { BottomSheetHeader } from './BottomSheet/BottomSheetHeader';

// ヘッダー・フッターコンポーネント
export { Header } from './header/Header';
export { Navigation } from './header/internals/Navigation';
export { NavigationItem } from './header/internals/NavigationItem';
export { DesktopNavigation } from './header/internals/DesktopNavigation';
export { HamburgerButton } from './header/internals/HamburgerButton';
export { MobileMenu } from './header/internals/MobileMenu';
export { Footer } from './footer/Footer';

// SEOコンポーネント
export { JsonLd } from './seo/JsonLd';

// API・フック
export { useApi, useApiQuery, useApiPagination } from '../hooks/useApi';
export { apiClient } from '../utils/apiClient';
