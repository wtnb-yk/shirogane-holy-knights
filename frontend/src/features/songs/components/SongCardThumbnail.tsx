'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Music, ExternalLink, Play, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// 型定義
type ThumbnailVariant = 'default' | 'playable' | 'detail';
type ThumbnailSize = 'sm' | 'md' | 'lg' | 'xl';
type AspectRatio = 'square' | 'video';

interface SongCardThumbnailProps {
  videoId: string | null;
  title: string;
  size?: ThumbnailSize;
  showOverlay?: boolean;
  className?: string;
  aspectRatio?: AspectRatio;
  variant?: ThumbnailVariant;
}

// アイコンマッピング
const VARIANT_ICON_MAP: Record<Exclude<ThumbnailVariant, 'default'>, LucideIcon> = {
  playable: Play,
  detail: ExternalLink,
} as const;

// サイズクラス定義
const SIZE_CLASSES: Record<ThumbnailSize, Record<AspectRatio, string>> = {
  sm: { square: 'w-12 h-12', video: 'w-20 h-11' },
  md: { square: 'w-16 h-16', video: 'w-32 h-18' },
  lg: { square: 'w-20 h-20', video: 'w-40 h-22' },
  xl: { square: 'w-24 h-24', video: 'w-48 h-27' },
} as const;

// 画像サイズ定義
const IMAGE_DIMENSIONS: Record<ThumbnailSize, Record<AspectRatio, { width: number; height: number }>> = {
  sm: { 
    square: { width: 48, height: 48 },
    video: { width: 80, height: 45 }
  },
  md: { 
    square: { width: 64, height: 64 },
    video: { width: 128, height: 72 }
  },
  lg: { 
    square: { width: 80, height: 80 },
    video: { width: 160, height: 90 }
  },
  xl: { 
    square: { width: 96, height: 96 },
    video: { width: 192, height: 108 }
  },
} as const;

// アイコンサイズ定義
const ICON_SIZES: Record<ThumbnailSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
} as const;

// オーバーレイアイコンサイズ定義
const OVERLAY_ICON_SIZES: Record<ThumbnailSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
} as const;

export const SongCardThumbnail: React.FC<SongCardThumbnailProps> = ({ 
  videoId, 
  title, 
  size = 'md', 
  showOverlay = false,
  className,
  aspectRatio = 'square',
  variant = 'default'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // サイズクラスの取得
  const sizeClass = SIZE_CLASSES[size][aspectRatio];
  const imageDimensions = IMAGE_DIMENSIONS[size][aspectRatio];
  const iconSize = ICON_SIZES[size];
  const overlayIconSize = OVERLAY_ICON_SIZES[size];

  // オーバーレイアイコンの取得
  const OverlayIcon = variant !== 'default' ? VARIANT_ICON_MAP[variant] : null;

  // videoIdがない、またはエラーの場合のフォールバック
  if (!videoId || imageError) {
    return (
      <div className={cn(
        sizeClass,
        'flex items-center justify-center rounded-lg bg-accent-gold/20 flex-shrink-0',
        className
      )}>
        <Music className={cn(iconSize, 'text-accent-gold')} />
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div className={cn(
      sizeClass,
      'relative rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0 group',
      className
    )}>
      <Image
        src={thumbnailUrl}
        alt={`${title}のサムネイル`}
        width={imageDimensions.width}
        height={imageDimensions.height}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-200',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
        unoptimized
      />
      
      {/* ローディング中の表示 */}
      {!isLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary">
          <Music className={cn(iconSize, 'text-text-tertiary animate-pulse')} />
        </div>
      )}

      {/* オーバーレイアイコン */}
      {showOverlay && isLoaded && OverlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="rounded-full bg-white/90 p-1">
            <OverlayIcon className={cn(
              overlayIconSize, 
              'text-text-primary',
              variant === 'playable' && 'fill-current'
            )} />
          </div>
        </div>
      )}
    </div>
  );
};