'use client';

import React from 'react';
import { NewsDto } from '../types/types';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { getImageUrl } from '@/utils/imageUrl';
import { NewsCardImage } from './NewsCard/NewsCardImage';
import { NewsCardMeta } from './NewsCard/NewsCardMeta';
import { NewsCardBody } from './NewsCard/NewsCardBody';

interface NewsCardProps {
  news: NewsDto;
  index: number;
}

interface NewsCardContentProps {
  news: NewsDto;
  imageUrl: string | undefined;
  isExternalLink: boolean;
}

const NewsCardContent = ({ news, imageUrl, isExternalLink }: NewsCardContentProps) => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* 画像部分 */}
      {imageUrl && (
        <NewsCardImage
          imageUrl={imageUrl}
          alt={news.title}
        />
      )}

      {/* コンテンツ部分 */}
      <div className="flex-1 min-w-0 p-4 md:p-4 flex flex-col justify-between">
        <div>
          <NewsCardMeta
            news={news}
            isExternalLink={isExternalLink}
          />
          <NewsCardBody
            news={news}
            isExternalLink={isExternalLink}
          />
        </div>
      </div>
    </div>
  );
};

const NewsCardComponent = ({ news, index }: NewsCardProps) => {
  // 画像URLを生成（S3パスまたは外部URL対応）
  const imageUrl = getImageUrl(news.thumbnailUrl);

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
          <NewsCardContent
            news={news}
            imageUrl={imageUrl}
            isExternalLink={true}
          />
        </InteractiveCard>
      ) : (
        <InteractiveCard hoverScale="sm" className="border-0 rounded-lg bg-bg-primary overflow-hidden">
          <NewsCardContent
            news={news}
            imageUrl={imageUrl}
            isExternalLink={false}
          />
        </InteractiveCard>
      )}
    </StaggeredItem>
  );
};

NewsCardComponent.displayName = 'NewsCard';

export const NewsCard = React.memo(NewsCardComponent);
