'use client';

import React from 'react';
import { BaseGrid } from '@/components/common/BaseGrid';
import { NewsDto } from '../types/types';
import { NewsCard } from './NewsCard';
import { SkeletonNewsCard } from './SkeletonNewsCard';

interface NewsGridProps {
  news: NewsDto[];
  loading: boolean;
  error: string | null;
}

export const NewsGrid = ({ news, loading, error }: NewsGridProps) => {
  return (
    <BaseGrid
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
      gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    />
  );
};