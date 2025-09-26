'use client';

import React from 'react';
import { NewsListGrid } from './internals/NewsListGrid';
import { NewsDto } from '../../types/types';
import { NewsCard } from '../cards/NewsCard';
import { SkeletonNewsCard } from '../cards/SkeletonNewsCard';

interface NewsGridProps {
  news: NewsDto[];
  loading: boolean;
  error: string | null;
}

export const NewsGrid = ({ news, loading, error }: NewsGridProps) => {
  return (
    <NewsListGrid
      items={news}
      loading={loading}
      error={error}
      renderItem={(newsItem, index) => <NewsCard key={newsItem.id} news={newsItem} index={index} />}
      renderSkeleton={(index) => <SkeletonNewsCard index={index} />}
      emptyMessage={{
        title: 'ニュースが見つかりませんでした',
        subtitle: '検索条件を変更してお試しください'
      }}
      skeletonCount={6}
    />
  );
};