'use client';

import React, { ReactElement } from 'react';
import { ErrorDisplay } from '@/components/Error/ErrorDisplay';
import { ApiError } from '@/utils/apiClient';

interface SpecialsListGridProps<T> {
  items: T[];
  loading: boolean;
  error: ApiError | null;
  renderItem: (item: T, index: number) => ReactElement;
  renderSkeleton: (index: number) => ReactElement;
  emptyMessage?: {
    title: string;
    subtitle: string;
  };
  skeletonCount?: number;
}

function SpecialsListGridComponent<T>({
  items,
  loading,
  error,
  renderItem,
  renderSkeleton,
  emptyMessage = {
    title: '現在開催中のスペシャルイベントはありません。',
    subtitle: ''
  },
  skeletonCount = 6
}: SpecialsListGridProps<T>) {
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="text-center py-12">
        <p className="text-text-secondary">{emptyMessage.title}</p>
        {emptyMessage.subtitle && (
          <p className="text-text-tertiary text-sm mt-2">{emptyMessage.subtitle}</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}

export const SpecialsListGrid = React.memo(SpecialsListGridComponent) as <T>(props: SpecialsListGridProps<T>) => ReactElement;
