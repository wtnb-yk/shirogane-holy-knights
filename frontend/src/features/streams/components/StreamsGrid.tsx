'use client';

import React from 'react';
import { BaseGrid } from '@/components/common/BaseGrid';
import { StreamDto } from '../types/types';
import { StreamCard } from './StreamCard';
import { SkeletonCard } from './SkeletonCard';

interface StreamsGridProps {
  streams: StreamDto[];
  loading: boolean;
  error?: string | null;
}

export const StreamsGrid = ({ streams, loading, error }: StreamsGridProps) => {
  return (
    <BaseGrid
      items={streams}
      loading={loading}
      error={error || null}
      renderItem={(stream, index) => <StreamCard key={stream.id} stream={stream} index={index} />}
      renderSkeleton={(index) => <SkeletonCard index={index} />}
      emptyMessage={{
        title: '配信が見つかりませんでした',
        subtitle: '検索条件を変更してお試しください'
      }}
      skeletonCount={8}
      gridClassName="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    />
  );
};