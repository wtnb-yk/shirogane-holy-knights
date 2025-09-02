'use client';

import React, { ReactElement } from 'react';

interface BaseGridProps<T> {
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
  gridClassName?: string;
}

export function BaseGrid<T>({
  items,
  loading,
  error,
  renderItem,
  renderSkeleton,
  emptyMessage = {
    title: 'データが見つかりませんでした',
    subtitle: '検索条件を変更してお試しください'
  },
  skeletonCount = 6,
  gridClassName = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
}: BaseGridProps<T>) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="text-center">
          <div className="text-error text-lg font-medium mb-2">エラーが発生しました</div>
          <div className="text-text-secondary text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`grid ${gridClassName} gap-0.5 mb-8 opacity-0 animate-slide-up rounded-lg overflow-hidden`} style={{ animationDelay: '200ms' }}>
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
    <div className={`grid ${gridClassName} gap-0.5 mb-8 opacity-0 animate-slide-up rounded-lg overflow-hidden`} style={{ animationDelay: '200ms' }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}