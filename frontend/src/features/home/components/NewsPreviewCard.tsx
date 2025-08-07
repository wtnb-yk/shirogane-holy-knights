'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { NewsDto } from '@/features/news/types/types';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { getImageUrl } from '@/utils/imageUrl';
import { TEXT_CLAMP, IMAGE_STYLES } from '@/constants/styles';

interface NewsPreviewCardProps {
  news: NewsDto;
  index: number;
}

const getCategoryBadgeStyle = (categoryName: string) => {
  switch (categoryName) {
    case 'グッズ':
      return 'bg-badge-blue/20 text-badge-blue border-badge-blue/30';
    case 'コラボ':
      return 'bg-badge-green/20 text-badge-green border-badge-green/30';
    case 'イベント':
      return 'bg-badge-orange/20 text-badge-orange border-badge-orange/30';
    case 'メディア':
      return 'bg-badge-purple/20 text-badge-purple border-badge-purple/30';
    default:
      return 'bg-badge-gray/20 text-badge-gray border-badge-gray/30';
  }
};

const NewsPreviewCardComponent = ({ news, index }: NewsPreviewCardProps) => {
  const imageUrl = getImageUrl(news.thumbnailUrl);
  
  const getPrimaryCategory = () => {
    if (news.categories && news.categories.length > 0) {
      return news.categories[0];
    }
    if (news.categoryName) {
      return { id: 0, name: news.categoryName };
    }
    return null;
  };

  const primaryCategory = getPrimaryCategory();

  const cardContent = (
    <div className="h-full flex flex-col">
      {/* 画像部分 */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-accent-blue/10 to-accent-beige/10 rounded-t-lg">
        {imageUrl ? (
          <>
            <Image 
              src={imageUrl} 
              alt={news.title} 
              fill
              className="object-cover image-hover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={IMAGE_STYLES.placeholder}
            />
            <div className="image-overlay" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-4xl opacity-20">📰</div>
          </div>
        )}
      </div>
      
      {/* コンテンツ部分 */}
      <div className="flex-1 p-4 flex flex-col">
        {/* カテゴリバッジ */}
        {primaryCategory && (
          <div className="mb-2">
            <Badge
              variant="outline"
              className={`text-xs border ${getCategoryBadgeStyle(primaryCategory.name)}`}
            >
              {primaryCategory.name}
            </Badge>
          </div>
        )}
        
        {/* タイトル */}
        <h3 className={`text-base font-semibold mb-2 ${TEXT_CLAMP[2]} text-text-primary flex-1`}>
          {news.title}
        </h3>
        
        {/* 日付情報 */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-auto">
          <Calendar className="w-3.5 h-3.5 text-accent-gold" />
          <span className="font-medium">
            {new Date(news.publishedAt).toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <StaggeredItem index={index} className="group">
      <InteractiveCard
        href={news.externalUrl || '#'}
        target={news.externalUrl ? "_blank" : undefined}
        rel={news.externalUrl ? "noopener noreferrer" : undefined}
        hoverScale="sm"
        className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg bg-bg-primary overflow-hidden"
      >
        {cardContent}
      </InteractiveCard>
    </StaggeredItem>
  );
};

NewsPreviewCardComponent.displayName = 'NewsPreviewCard';

export const NewsPreviewCard = React.memo(NewsPreviewCardComponent);