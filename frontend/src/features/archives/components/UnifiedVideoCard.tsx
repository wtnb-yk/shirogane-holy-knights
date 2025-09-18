'use client';

import Image from 'next/image';
import { Calendar, Tag, PlayCircle, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { IMAGE_STYLES } from '@/constants/styles';
import { VideoCardProps } from '@/types/components';
import { cn } from '@/lib/utils';

/**
 * 統一された動画カードコンポーネント
 * 通常、フィーチャー、ピックアップの各バリアントに対応
 */
export const UnifiedVideoCard = ({ video, index, variant = 'default', className }: VideoCardProps) => {
  // バリアント別のスタイル設定
  const variantStyles = {
    default: {
      container: 'group',
      card: 'rounded-lg overflow-hidden h-full',
      image: 'aspect-video',
      overlay: null,
      badge: null
    },
    featured: {
      container: 'group col-span-1 md:col-span-2 md:row-span-2',
      card: 'rounded-lg overflow-hidden h-full relative',
      image: 'aspect-video',
      overlay: <PlayCircle className="absolute top-4 right-4 w-8 h-8 text-white opacity-80" />,
      badge: null
    },
    pickup: {
      container: 'group col-span-1 md:col-span-2 md:row-span-2',
      card: 'rounded-lg overflow-hidden h-full relative',
      image: 'aspect-video',
      overlay: <Star className="absolute top-4 right-4 w-8 h-8 text-yellow-400 opacity-90" />,
      badge: (
        <Badge variant="default" className="absolute top-4 left-4 bg-yellow-500 text-white">
          ピックアップ
        </Badge>
      )
    }
  };

  const currentVariant = variantStyles[variant];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return null;
    
    // ISO 8601 duration format (PT1H30M45S) を解析
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StaggeredItem index={index} className={cn(currentVariant.container, className)}>
      <InteractiveCard
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${video.title}をYouTubeで視聴`}
        hoverScale="sm"
        className={currentVariant.card}
      >
        {video.thumbnailUrl && (
          <div className={cn('relative w-full overflow-hidden bg-bg-accent', currentVariant.image)}>
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className={cn(
                'object-cover transition-transform duration-300 group-hover:scale-105',
                IMAGE_STYLES.hover
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
            
            {/* バリアント別のオーバーレイ */}
            {currentVariant.overlay}
            {currentVariant.badge}
            
            {/* 動画時間表示 */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
            )}
            
            {/* メンバー限定バッジ */}
            {video.isMembersOnly && (
              <Badge 
                variant="secondary" 
                className="absolute top-2 left-2 bg-green-600 text-white text-xs"
              >
                メンバー限定
              </Badge>
            )}
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* タイトル */}
          <h3 className="font-semibold text-text-primary line-clamp-2 text-sm md:text-base leading-tight group-hover:text-accent-gold transition-colors">
            {video.title}
          </h3>

          {/* 公開日 */}
          <div className="flex items-center gap-2 text-text-tertiary text-xs">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(video.publishedAt)}</span>
          </div>

          {/* タグ */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {video.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge 
                    key={tagIndex} 
                    variant="outline" 
                    className="text-xs px-2 py-0.5 bg-bg-secondary border-surface-border text-text-secondary hover:bg-bg-accent transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
                {video.tags.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0.5 bg-bg-secondary border-surface-border text-text-tertiary"
                  >
                    +{video.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* 説明文（フィーチャー・ピックアップバリアントでのみ表示） */}
          {(variant === 'featured' || variant === 'pickup') && video.description && (
            <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </InteractiveCard>
    </StaggeredItem>
  );
};

// 後方互換性のためのエクスポート
export const VideoCard = (props: Omit<VideoCardProps, 'variant'>) => (
  <UnifiedVideoCard {...props} variant="default" />
);

export const FeaturedVideoCard = (props: Omit<VideoCardProps, 'variant'>) => (
  <UnifiedVideoCard {...props} variant="featured" />
);

export const PickupVideoCard = (props: Omit<VideoCardProps, 'variant'>) => (
  <UnifiedVideoCard {...props} variant="pickup" />
);