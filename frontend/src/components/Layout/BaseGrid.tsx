'use client';

import React, { ReactNode, useMemo } from 'react';
import { ErrorDisplay } from '@/components/Error';

interface BaseGridProps<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  renderItem: (item: T, index: number) => ReactNode;
  renderSkeleton: (index: number) => ReactNode;
  emptyMessage?: {
    title: string;
    subtitle: string;
  };
  skeletonCount?: number;
  gridClassName?: string;
}

const DEFAULT_EMPTY_MESSAGE = {
  title: 'データが見つかりませんでした',
  subtitle: '検索条件を変更してお試しください'
};

const DEFAULT_GRID_CLASS = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';

function BaseGridComponent<T>({
  items,
  loading,
  error,
  renderItem,
  renderSkeleton,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  skeletonCount = 6,
  gridClassName = DEFAULT_GRID_CLASS
}: BaseGridProps<T>) {
  // Memoize skeleton array to prevent recreation on every render
  const skeletonItems = useMemo(() => 
    Array.from({ length: skeletonCount }, (_, index) => index),
    [skeletonCount]
  );

  // Memoize grid classes
  const gridClasses = useMemo(() =>
    `grid ${gridClassName} gap-0.5 mb-8 opacity-0 animate-slide-up rounded-lg`,
    [gridClassName]
  );

  if (error) {
    return (
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <ErrorDisplay 
          error={error} 
          context="データの取得"
          size="md"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={gridClasses} style={{ animationDelay: '200ms' }}>
        {skeletonItems.map((index) => (
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
    <div className={gridClasses} style={{ animationDelay: '200ms' }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}

// Export memoized version
export const BaseGrid = React.memo(BaseGridComponent) as <T>(props: BaseGridProps<T>) => React.ReactElement;
