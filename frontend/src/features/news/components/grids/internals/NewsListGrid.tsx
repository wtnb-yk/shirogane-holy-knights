'use client';

import React, { ReactElement } from 'react';
import { ErrorDisplay } from '@/components/Error/ErrorDisplay';

interface NewsListGridProps<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  renderItem: (item: T, index: number) => ReactElement;
  renderSkeleton: (index: number) => ReactElement;
  emptyMessage?: {
    title: string;
    subtitle: string;
  };
  skeletonCount?: number;
}

function NewsListGridComponent<T>({
  items,
  loading,
  error,
  renderItem,
  renderSkeleton,
  emptyMessage = {
    title: 'データが見つかりませんでした',
    subtitle: '検索条件を変更してお試しください'
  },
  skeletonCount = 6
}: NewsListGridProps<T>) {
  if (error) {
    return (
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <ErrorDisplay 
          error={error} 
          context="ニュース一覧の取得"
          size="md"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-2 mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <React.Fragment key={index}>
            {renderSkeleton(index)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="text-center">
          <div className="text-text-secondary text-lg font-medium mb-2">{emptyMessage.title}</div>
          <div className="text-text-muted text-sm">{emptyMessage.subtitle}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}

// Export memoized version
export const NewsListGrid = React.memo(NewsListGridComponent) as <T>(props: NewsListGridProps<T>) => ReactElement;