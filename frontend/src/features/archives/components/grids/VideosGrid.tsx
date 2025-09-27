'use client';

import React, { useMemo, useCallback } from 'react';
import { VideoDto } from '../../types/types';
import { VideoCard } from '../cards/VideoCard';
import { SkeletonCard } from '../cards/SkeletonCard';
import { BaseGrid } from '@/components/common/BaseGrid';
import { 
  getVideoGridColumns, 
  DEFAULT_EMPTY_MESSAGE 
} from '../../config/gridConfig';
import { generateGridClassName } from '../../utils/gridLayoutCalculator';

interface VideosGridProps {
  videos: VideoDto[];
  loading: boolean;
  error?: string | null;
}

const VideosGridComponent = ({ 
  videos, 
  loading, 
  error
}: VideosGridProps) => {
  // Memoize grid configuration
  const gridConfig = useMemo(() => {
    const gridColumns = getVideoGridColumns();
    const gridClassName = generateGridClassName(gridColumns);
    return {
      columns: gridColumns,
      className: gridClassName.replace('grid ', '')
    };
  }, []);
  
  // Memoize render functions to prevent unnecessary re-renders
  const renderItem = useCallback((video: VideoDto, index: number) => (
    <VideoCard key={video.id} video={video} index={index} />
  ), []);
  
  const renderSkeleton = useCallback((index: number) => (
    <SkeletonCard key={index} index={index} />
  ), []);
  
  // Memoize empty message
  const emptyMessage = useMemo(() => DEFAULT_EMPTY_MESSAGE.videos, []);
  
  return (
    <BaseGrid
      items={videos}
      loading={loading}
      error={error ?? null}
      renderItem={renderItem}
      renderSkeleton={renderSkeleton}
      emptyMessage={emptyMessage}
      gridClassName={gridConfig.className}
    />
  );
};

// Memoize the entire component
export const VideosGrid = React.memo(VideosGridComponent);
