'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { NewsDto } from '../types/types';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { getImageUrl } from '@/utils/imageUrl';
import { TEXT_CLAMP, IMAGE_STYLES, BACKGROUND_OPACITY } from '@/constants/styles';

interface NewsCardProps {
  news: NewsDto;
  index: number;
}

// カテゴリバッジのスタイル（Tailwindカラーパレット統一）
const getCategoryBadgeStyle = (categoryName: string) => {
  switch (categoryName) {
    case 'グッズ':
      return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
    case 'コラボ':
      return 'bg-accent-green/20 text-accent-green border-accent-green/30';
    case 'イベント':
      return 'bg-accent-beige/30 text-text-primary border-accent-beige/50';
    case 'メディア':
      return 'bg-accent-gold/20 text-accent-gold border-accent-gold/30';
    default:
      return `${BACKGROUND_OPACITY.accent.medium} text-text-primary ${BACKGROUND_OPACITY.surface.medium}`;
  }
};

const NewsCardComponent = ({ news, index }: NewsCardProps) => {
  // 画像URLを生成（S3パスまたは外部URL対応）
  const imageUrl = getImageUrl(news.thumbnailUrl);
  
  const cardContent = (
    <InteractiveCard hoverScale="sm" className="border-0">
      <div className="flex flex-col sm:flex-row">
        {/* 画像部分 */}
        {imageUrl && (
          <div className="relative w-full sm:w-80 h-52 sm:h-[200px] flex-shrink-0 overflow-hidden bg-bg-accent">
            <Image 
              src={imageUrl} 
              alt={news.title} 
              fill
              className="object-cover image-hover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 320px"
              placeholder="blur"
              blurDataURL={IMAGE_STYLES.placeholder}
            />
            <div className="image-overlay" />
          </div>
        )}
        
        {/* コンテンツ部分 */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* カテゴリバッジ */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {/* 複数カテゴリ対応 */}
              {news.categories && news.categories.length > 0 ? (
                news.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className={`text-xs border ${getCategoryBadgeStyle(category.name)}`}
                  >
                    {category.name}
                  </Badge>
                ))
              ) : (
                // 後方互換性のため（旧形式サポート）
                news.categoryName && (
                  <Badge
                    variant="outline"
                    className={`text-xs border ${getCategoryBadgeStyle(news.categoryName)}`}
                  >
                    {news.categoryName}
                  </Badge>
                )
              )}
            </div>
            
            {/* 日付情報 */}
            <div className="flex items-center gap-1 text-xs text-text-secondary mb-3">
              <Calendar className="w-3 h-3" />
              <span>{new Date(news.publishedAt).toLocaleDateString('ja-JP')}</span>
            </div>
            
            {/* タイトル */}
            <h3 className={`text-base font-bold mb-2 ${TEXT_CLAMP[2]} text-text-primary`}>
              {news.title}
            </h3>
            
            {/* コンテンツ */}
            {news.content && (
              <p className={`text-sm text-text-secondary ${TEXT_CLAMP[3]} mb-2`}>
                {news.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </InteractiveCard>
  );

  return (
    <StaggeredItem index={index} className="group">
      {news.externalUrl ? (
        <InteractiveCard
          href={news.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          hoverScale="sm"
          className="border-0"
        >
          <div className="flex flex-col sm:flex-row">
            {/* 画像部分 */}
            {imageUrl && (
              <div className="relative w-full sm:w-80 h-52 sm:h-[200px] flex-shrink-0 overflow-hidden bg-bg-accent">
                <Image 
                  src={imageUrl} 
                  alt={news.title} 
                  fill
                  className="object-cover image-hover"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 320px"
                  placeholder="blur"
                  blurDataURL={IMAGE_STYLES.placeholder}
                />
                <div className="image-overlay" />
              </div>
            )}
            
            {/* コンテンツ部分 */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                {/* カテゴリバッジ */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {/* 複数カテゴリ対応 */}
                  {news.categories && news.categories.length > 0 ? (
                    news.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className={`text-xs border ${getCategoryBadgeStyle(category.name)}`}
                      >
                        {category.name}
                      </Badge>
                    ))
                  ) : (
                    // 後方互換性のため（旧形式サポート）
                    news.categoryName && (
                      <Badge
                        variant="outline"
                        className={`text-xs border ${getCategoryBadgeStyle(news.categoryName)}`}
                      >
                        {news.categoryName}
                      </Badge>
                    )
                  )}
                </div>
                
                {/* 日付情報 */}
                <div className="flex items-center gap-1 text-xs text-text-secondary mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(news.publishedAt).toLocaleDateString('ja-JP')}</span>
                </div>
                
                {/* タイトル */}
                <h3 className={`text-base font-bold mb-2 ${TEXT_CLAMP[2]} text-text-primary`}>
                  {news.title}
                </h3>
                
                {/* コンテンツ */}
                {news.content && (
                  <p className={`text-sm text-text-secondary ${TEXT_CLAMP[3]} mb-2`}>
                    {news.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        </InteractiveCard>
      ) : (
        cardContent
      )}
    </StaggeredItem>
  );
};

NewsCardComponent.displayName = 'NewsCard';

export const NewsCard = React.memo(NewsCardComponent);
