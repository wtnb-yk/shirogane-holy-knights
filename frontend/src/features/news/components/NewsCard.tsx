'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { NewsDto } from '../types/types';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { OverlayIcon } from '@/components/ui/OverlayIcon';
import { getImageUrl } from '@/utils/imageUrl';
import { IMAGE_STYLES } from '@/constants/styles';
import { getCategoryDisplayName } from '@/constants/newsCategories';
import { getCategoryBadgeStyle } from '../utils/categoryStyles';

interface NewsCardProps {
  news: NewsDto;
  index: number;
}


const NewsCardComponent = ({ news, index }: NewsCardProps) => {
  // 画像URLを生成（S3パスまたは外部URL対応）
  const imageUrl = getImageUrl(news.thumbnailUrl);
  
  const cardContent = (
    <InteractiveCard hoverScale="sm" className="border-0 rounded-lg bg-bg-primary overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* 画像部分 */}
        {imageUrl && (
          <div className="relative w-full md:w-80 h-48 md:h-[200px] flex-shrink-0 overflow-hidden bg-bg-accent">
            <Image 
              src={imageUrl} 
              alt={news.title} 
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 767px) 100vw, 320px"
              placeholder="blur"
              blurDataURL={IMAGE_STYLES.placeholder}
            />
            <OverlayIcon
              type="external-link"
              isVisible={false}
              className="group-hover:opacity-100"
            />
          </div>
        )}
        
        {/* コンテンツ部分 */}
        <div className="flex-1 min-w-0 p-4 md:p-4 flex flex-col justify-between">
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
                    {getCategoryDisplayName(category.name)}
                  </Badge>
                ))
              ) : (
                // 後方互換性のため（旧形式サポート）
                news.categoryName && (
                  <Badge
                    variant="outline"
                    className={`text-xs border ${getCategoryBadgeStyle(news.categoryName)}`}
                  >
                    {getCategoryDisplayName(news.categoryName)}
                  </Badge>
                )
              )}
            </div>
            
            {/* 日付情報 */}
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-2 md:mb-3">
              <Calendar className="w-3.5 h-3.5 text-accent-gold" />
              <span className="font-medium">{new Date(news.publishedAt).toLocaleDateString('ja-JP')}</span>
            </div>
            
            {/* タイトル */}
            <h3 className="text-base md:text-lg font-semibold mb-2 text-text-primary hover:text-accent-blue transition-colors duration-ui">
              {news.title}
            </h3>
            
            {/* コンテンツ */}
            {news.content && (
              <p className="text-sm text-text-secondary mb-1 leading-normal">
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
          className="border-0 rounded-lg bg-bg-primary overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* 画像部分 */}
            {imageUrl && (
              <div className="relative w-full md:w-80 h-48 md:h-[200px] flex-shrink-0 overflow-hidden bg-bg-accent">
                <Image 
                  src={imageUrl} 
                  alt={news.title} 
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 767px) 100vw, 320px"
                  placeholder="blur"
                  blurDataURL={IMAGE_STYLES.placeholder}
                />
                <OverlayIcon
                  type="external-link"
                  isVisible={false}
                  className="group-hover:opacity-100"
                />
              </div>
            )}
            
            {/* コンテンツ部分 */}
            <div className="flex-1 min-w-0 p-4 md:p-4 flex flex-col justify-between">
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
                        {getCategoryDisplayName(category.name)}
                      </Badge>
                    ))
                  ) : (
                    // 後方互換性のため（旧形式サポート）
                    news.categoryName && (
                      <Badge
                        variant="outline"
                        className={`text-xs border ${getCategoryBadgeStyle(news.categoryName)}`}
                      >
                        {getCategoryDisplayName(news.categoryName)}
                      </Badge>
                    )
                  )}
                </div>
                
                {/* 日付情報 */}
                <div className="flex items-center gap-1 text-xs text-text-secondary mb-2 md:mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(news.publishedAt).toLocaleDateString('ja-JP')}</span>
                </div>
                
                {/* タイトル */}
                <h3 className="text-sm md:text-base font-bold mb-2 text-text-primary">
                  {news.title}
                </h3>
                
                {/* コンテンツ */}
                {news.content && (
                  <p className="text-sm text-text-secondary mb-1 leading-normal">
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
