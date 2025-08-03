'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ExternalLink } from 'lucide-react';
import { NewsDto } from '../types/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  news: NewsDto;
  index: number;
}

// カテゴリバッジのスタイル
const getCategoryBadgeStyle = (categoryName: string) => {
  switch (categoryName) {
    case 'GOODS':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'COLLABORATION':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'EVENT':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'MEDIA':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-sage-100 text-sage-800 border-sage-200';
  }
};

const NewsCardComponent = ({ news, index }: NewsCardProps) => {
  return (
    <div 
      className="group opacity-0 animate-fade-in" 
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sage-300/20 bg-white border-0 hover:scale-[1.01] hover:-translate-y-1">
        <div className="flex flex-col sm:flex-row">
          {/* 画像部分 */}
          {news.thumbnailUrl && (
            <div className="relative w-full sm:w-80 h-48 sm:h-[180px] flex-shrink-0 overflow-hidden bg-sage-100">
              <Image 
                src={news.thumbnailUrl} 
                alt={news.title} 
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 128px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          
          {/* コンテンツ部分 */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              {/* カテゴリとメタ情報 */}
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs border ${getCategoryBadgeStyle(news.categoryName)}`}
                >
                  {news.categoryDisplayName}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-sage-300">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(news.publishedAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </div>
              
              {/* タイトル */}
              <Link href={`/news/${news.id}`}>
                <h3 className="text-base font-bold mb-2 line-clamp-2 text-gray-800 group-hover:text-sage-300 transition-colors duration-200 cursor-pointer">
                  {news.title}
                </h3>
              </Link>
              
              {/* 要約 */}
              <p className="text-sm text-gray-600 line-clamp-4 mb-2">
                {news.summary}
              </p>
            </div>
            
            {/* フッター */}
            <div className="flex justify-between items-center">
              <Link
                href={`/news/${news.id}`}
                className="inline-flex items-center gap-1 text-sm text-sage-300 hover:text-gray-800 font-medium transition-all duration-300 hover:translate-x-1"
              >
                詳細を見る
                <ExternalLink className="w-3 h-3" />
              </Link>
              
              {news.externalUrl && (
                <a
                  href={news.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-sage-300 transition-colors duration-200"
                >
                  外部リンク
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

NewsCardComponent.displayName = 'NewsCard';

export const NewsCard = React.memo(NewsCardComponent);