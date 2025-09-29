'use client';

import React from 'react';
import { OptimizedImage } from '@/components/Image/OptimizedImage';
import { Calendar, ExternalLink } from 'lucide-react';
import { NewsDto } from '@/features/news/types/types';
import { Badge } from '@/components/Badge/badge';
import { InteractiveCard } from '@/components/Card/InteractiveCard';
import { StaggeredItem } from '@/components/Card/StaggeredItem';
import { getImageUrl } from '@/utils/imageUrl';
import { getCategoryDisplayName } from '@/constants/newsCategories';
import { getCategoryBadgeStyle } from '@/features/news/utils/categoryStyles';

interface NewsPreviewCardProps {
  news: NewsDto;
  index: number;
}


const NewsPreviewCardComponent = ({ news, index }: NewsPreviewCardProps) => {
  const imageUrl = getImageUrl(news.thumbnailUrl);
  
  const categories = news.categories || [];
  const maxDisplayTags = 3;
  const hasMoreTags = categories.length > maxDisplayTags;
  const displayedCategories = categories.slice(0, maxDisplayTags);

  const cardContent = (
    <div className="h-full flex flex-col">
      {/* 画像部分 */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-accent-blue/10 to-accent-beige/10 rounded-t-lg">
        {imageUrl ? (
          <>
            <OptimizedImage
              src={imageUrl}
              alt={news.title}
              fill
              className="object-cover image-hover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
            <div className="image-overlay" />
            {/* 外部リンクアイコン */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-black/50 rounded-full p-3">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
            </div>
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
        {categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5 items-center">
            {displayedCategories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className={`text-xs border ${getCategoryBadgeStyle(category.name)}`}
              >
                {getCategoryDisplayName(category.name)}
              </Badge>
            ))}
            {hasMoreTags && (
              <Badge
                variant="outline"
                className="text-xs border bg-badge-gray/20 text-badge-gray border-badge-gray/30"
              >
                +{categories.length - maxDisplayTags}
              </Badge>
            )}
          </div>
        )}
        
        {/* タイトル */}
        <h3 className="text-base font-semibold mb-2 text-text-primary flex-1">
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
