'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Play } from 'lucide-react';
import { VideoDto } from '@/features/videos/types/types';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { getImageUrl } from '@/utils/imageUrl';
import { TEXT_CLAMP, IMAGE_STYLES } from '@/constants/styles';

interface ArchivePreviewCardProps {
  video: VideoDto;
  index: number;
}

const getTagBadgeStyle = (tag: string) => {
  const tagLower = tag.toLowerCase();
  if (tagLower.includes('minecraft') || tagLower.includes('マイクラ')) {
    return 'bg-badge-green/20 text-badge-green border-badge-green/30';
  } else if (tagLower.includes('apex') || tagLower.includes('エーペックス')) {
    return 'bg-badge-orange/20 text-badge-orange border-badge-orange/30';
  } else if (tagLower.includes('歌') || tagLower.includes('singing')) {
    return 'bg-badge-purple/20 text-badge-purple border-badge-purple/30';
  } else if (tagLower.includes('雑談') || tagLower.includes('chat')) {
    return 'bg-badge-blue/20 text-badge-blue border-badge-blue/30';
  }
  return 'bg-badge-gray/20 text-badge-gray border-badge-gray/30';
};

const ArchivePreviewCardComponent = ({ video, index }: ArchivePreviewCardProps) => {
  const imageUrl = getImageUrl(video.thumbnailUrl);
  
  const getPrimaryTag = () => {
    if (video.tags && video.tags.length > 0) {
      return video.tags[0];
    }
    return null;
  };

  const primaryTag = getPrimaryTag();

  const cardContent = (
    <div className="h-full flex flex-col">
      {/* 画像部分 */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-accent-gold/10 to-accent-beige/10 rounded-t-lg">
        {imageUrl ? (
          <>
            <Image 
              src={imageUrl} 
              alt={video.title} 
              fill
              className="object-cover image-hover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={IMAGE_STYLES.placeholder}
            />
            <div className="image-overlay" />
            {/* 再生アイコン */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-black/50 rounded-full p-3">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-4xl opacity-20">🎥</div>
          </div>
        )}
      </div>
      
      {/* コンテンツ部分 */}
      <div className="flex-1 p-4 flex flex-col">
        {/* タグバッジ */}
        {primaryTag && (
          <div className="mb-2">
            <Badge
              variant="outline"
              className={`text-xs border ${getTagBadgeStyle(primaryTag)}`}
            >
              {primaryTag}
            </Badge>
          </div>
        )}
        
        {/* タイトル */}
        <h3 className={`text-base font-semibold mb-2 ${TEXT_CLAMP[2]} text-text-primary flex-1`}>
          {video.title}
        </h3>
        
        {/* 日付情報 */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-auto">
          <Calendar className="w-3.5 h-3.5 text-accent-gold" />
          <span className="font-medium">
            {new Date(video.publishedAt).toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <StaggeredItem index={index} className="group">
      <InteractiveCard
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        hoverScale="sm"
        className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg bg-bg-primary overflow-hidden"
      >
        {cardContent}
      </InteractiveCard>
    </StaggeredItem>
  );
};

ArchivePreviewCardComponent.displayName = 'ArchivePreviewCard';

export const ArchivePreviewCard = React.memo(ArchivePreviewCardComponent);