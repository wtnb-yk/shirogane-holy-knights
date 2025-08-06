'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { NewsDto } from '../types/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '@/utils/imageUrl';

interface NewsCardProps {
  news: NewsDto;
  index: number;
}

// カテゴリバッジのスタイル
const getCategoryBadgeStyle = (categoryName: string) => {
  switch (categoryName) {
    case 'グッズ':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'コラボ':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'イベント':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'メディア':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-sage-100 text-sage-800 border-sage-200';
  }
};

const NewsCardComponent = ({ news, index }: NewsCardProps) => {
  // 画像URLを生成（S3パスまたは外部URL対応）
  const imageUrl = getImageUrl(news.thumbnailUrl);
  
  const cardContent = (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sage-300/20 bg-white border-0 hover:scale-[1.01] hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row">
        {/* 画像部分 */}
        {imageUrl && (
          <div className="relative w-full sm:w-80 h-52 sm:h-[200px] flex-shrink-0 overflow-hidden bg-sage-100">
            <Image 
              src={imageUrl} 
              alt={news.title} 
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 320px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            <div className="flex items-center gap-1 text-xs text-sage-300 mb-3">
              <Calendar className="w-3 h-3" />
              <span>{new Date(news.publishedAt).toLocaleDateString('ja-JP')}</span>
            </div>
            
            {/* タイトル */}
            <h3 className="text-base font-bold mb-2 line-clamp-2 text-gray-800">
              {news.title}
            </h3>
            
            {/* コンテンツ */}
            {news.content && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                {news.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div 
      className="group opacity-0 animate-fade-in" 
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      {news.externalUrl ? (
        <a
          href={news.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer"
        >
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </div>
  );
};

NewsCardComponent.displayName = 'NewsCard';

export const NewsCard = React.memo(NewsCardComponent);
