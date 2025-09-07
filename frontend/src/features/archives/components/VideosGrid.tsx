'use client';

import React from 'react';
import { VideoDto } from '../types/types';
import { VideoCard } from './VideoCard';
import { SkeletonCard } from './SkeletonCard';
import { BaseGrid } from '@/components/common/BaseGrid';
import { 
  getVideoGridColumns, 
  DEFAULT_EMPTY_MESSAGE 
} from '../config/specialGridConfig';
import { generateGridClassName } from '../utils/gridLayoutCalculator';

interface VideosGridProps {
  videos: VideoDto[];
  loading: boolean;
  error?: string | null;
  showFeatured?: boolean;
  isFirstPage?: boolean;
}

export const VideosGrid = ({ 
  videos, 
  loading, 
  error, 
  showFeatured = false, 
  isFirstPage = false 
}: VideosGridProps) => {
  // グリッド設定を取得
  const gridColumns = getVideoGridColumns();
  const gridClassName = generateGridClassName(gridColumns);
  
  // 通常アイテムのレンダラー
  const renderItem = (video: VideoDto, index: number) => (
    <VideoCard key={video.id} video={video} index={index} />
  );
  
  // スケルトンのレンダラー
  const renderSkeleton = (index: number) => (
    <SkeletonCard key={index} index={index} />
  );
  
  return (
    <BaseGrid
      items={videos}
      loading={loading}
      error={error}
      renderItem={renderItem}
      renderSkeleton={renderSkeleton}
      emptyMessage={DEFAULT_EMPTY_MESSAGE.videos}
      gridClassName={gridClassName.replace('grid ', '')}
    />
  );
};