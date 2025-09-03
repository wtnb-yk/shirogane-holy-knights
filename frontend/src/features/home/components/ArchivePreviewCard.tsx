'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { StreamDto } from '@/features/archives/types/types';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { OverlayIcon } from '@/components/ui/OverlayIcon';
import { getImageUrl } from '@/utils/imageUrl';
import { IMAGE_STYLES } from '@/constants/styles';

interface ArchivePreviewCardProps {
  stream: StreamDto;
  index: number;
}

const ArchivePreviewCardComponent = ({ stream, index }: ArchivePreviewCardProps) => {
  const imageUrl = getImageUrl(stream.thumbnailUrl);
  
  const getPrimaryTag = () => {
    if (stream.tags && stream.tags.length > 0) {
      return stream.tags[0];
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
              alt={stream.title} 
              fill
              className="object-cover image-hover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={IMAGE_STYLES.placeholder}
            />
            <div className="image-overlay" />
            <OverlayIcon
              type="play"
              isVisible={false}
              className="group-hover:opacity-100"
            />
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
              className={`text-xs border`}
            >
              {primaryTag}
            </Badge>
          </div>
        )}
        
        {/* タイトル */}
        <h3 className={`text-base font-semibold mb-2 text-text-primary flex-1`}>
          {stream.title}
        </h3>
        
        {/* 日付情報 */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-auto">
          <Calendar className="w-3.5 h-3.5 text-accent-gold" />
          <span className="font-medium">
            {stream.startedAt 
              ? new Date(stream.startedAt).toLocaleDateString('ja-JP')
              : '配信日未定'
            }
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <StaggeredItem index={index} className="group">
      <InteractiveCard
        href={stream.url}
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
