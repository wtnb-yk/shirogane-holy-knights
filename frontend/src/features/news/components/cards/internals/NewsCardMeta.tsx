'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/Badge/badge';
import { NewsDto } from '../../../types/types';
import { getCategoryDisplayName } from '@/constants/newsCategories';
import { getCategoryBadgeStyle } from '../../../utils/categoryStyles';

interface NewsCardMetaProps {
  news: NewsDto;
  isExternalLink: boolean;
}

export const NewsCardMeta = ({ news, isExternalLink }: NewsCardMetaProps) => {
  return (
    <>
      {/* カテゴリバッジ */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
      <div className={`flex items-center text-xs text-text-secondary mb-2 md:mb-3 ${
        isExternalLink ? 'gap-1' : 'gap-1.5'
      }`}>
        <Calendar className={`text-accent-gold ${
          isExternalLink ? 'w-3 h-3' : 'w-3.5 h-3.5'
        }`} />
        <span className={isExternalLink ? '' : 'font-medium'}>
          {new Date(news.publishedAt).toLocaleDateString('ja-JP')}
        </span>
      </div>
    </>
  );
};