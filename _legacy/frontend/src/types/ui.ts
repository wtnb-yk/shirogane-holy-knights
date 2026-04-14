/**
 * UI コンポーネント関連の型定義
 */

import { BaseComponentProps } from './common';

// ===== ボタン関連 =====

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

// ===== バッジ関連 =====

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

// ===== カード関連 =====

export interface InteractiveCardProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  hover?: boolean;
}

// ===== 画像関連 =====

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

// ===== オーバーレイアイコン =====

export type OverlayIconType = 'play' | 'pause' | 'volume' | 'external-link';

export interface OverlayIconProps {
  type: OverlayIconType;
  isVisible?: boolean;
  className?: string;
}

// ===== スケルトン関連 =====

export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export interface BaseSkeletonProps {
  index: number;
  showThumbnail?: boolean;
}

// ===== アニメーション関連 =====

export interface StaggeredItemProps extends BaseComponentProps {
  index: number;
  delay?: number;
}

export interface UseStaggerAnimationProps {
  index: number;
  customDelay?: number;
}

// ===== サイドバー関連 =====

export type SidebarWidth = 'sm' | 'md' | 'lg';

export interface GenericSidebarProps extends BaseComponentProps {
  width?: SidebarWidth | string;
  position?: 'left' | 'right';
}


export interface SidebarSectionProps extends BaseComponentProps {
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// ===== ドロップダウン関連 =====

export interface DropdownContentProps extends BaseComponentProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

// ===== フォーム関連 =====

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

// ===== 選択関連 =====

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// ===== タブ関連 =====

export interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps extends BaseComponentProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// ===== ツールチップ関連 =====

export interface TooltipProps extends BaseComponentProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
}

// ===== グリッド関連 =====

export interface BaseGridProps<T> extends BaseComponentProps {
  items: T[];
  loading: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: (index: number) => React.ReactNode;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: string;
}

// ===== 検索オプション関連 =====

export interface SearchOptionsButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  hasActiveFilters?: boolean;
}
