'use client';

import React from 'react';
import { BaseGrid } from '@/components/common/BaseGrid';
import { VideoDto } from '../types/types';
import { VideoCard } from './VideoCard';
import { SkeletonCard } from './SkeletonCard';

interface VideosGridProps {
  videos: VideoDto[];
  loading: boolean;
  error?: string | null;
}

export const VideosGrid = ({ videos, loading, error }: VideosGridProps) => {
  return (
    <BaseGrid
      items={videos}
      loading={loading}
      error={error || null}
      renderItem={(video, index) => <VideoCard key={video.id} video={video} index={index} />}
      renderSkeleton={(index) => <SkeletonCard index={index} />}
      emptyMessage={{
        title: '動画が見つかりませんでした',
        subtitle: '検索条件を変更してお試しください'
      }}
      skeletonCount={8}
      gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    />
  );
};