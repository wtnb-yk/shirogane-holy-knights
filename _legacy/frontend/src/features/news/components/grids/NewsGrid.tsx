'use client';

import React, { useMemo, useCallback } from 'react';
import { NewsListGrid } from './internals/NewsListGrid';
import { NewsDto } from '../../types/types';
import { NewsCard } from '../cards/NewsCard';
import { SkeletonNewsCard } from '../cards/SkeletonNewsCard';

interface NewsGridProps {
  news: NewsDto[];
  loading: boolean;
  error: string | null;
}

const NewsGridComponent = ({ news, loading, error }: NewsGridProps) => {
  // Memoize render functions to prevent unnecessary re-renders
  const renderItem = useCallback((newsItem: NewsDto, index: number) => (
    <NewsCard key={newsItem.id} news={newsItem} index={index} />
  ), []);

  const renderSkeleton = useCallback((index: number) => (
    <SkeletonNewsCard key={index} index={index} />
  ), []);

  // Memoize empty message
  const emptyMessage = useMemo(() => ({
    title: 'ニュースが見つかりませんでした',
    subtitle: '検索条件を変更してお試しください'
  }), []);

  return (
    <NewsListGrid
      items={news}
      loading={loading}
      error={error}
      renderItem={renderItem}
      renderSkeleton={renderSkeleton}
      emptyMessage={emptyMessage}
      skeletonCount={6}
    />
  );
};

NewsGridComponent.displayName = 'NewsGrid';

export const NewsGrid = React.memo(NewsGridComponent);