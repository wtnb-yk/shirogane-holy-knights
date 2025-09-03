'use client';

import React from 'react';
import { VideoDto } from '../types/types';
import { SpecialItemType } from '../types/specialGridTypes';
import { VideoCard } from './VideoCard';
import { FeaturedVideoCard } from './FeaturedVideoCard';
import { PickupVideoCard } from './PickupVideoCard';
import { SkeletonCard } from './SkeletonCard';
import { SpecialGrid } from './grid/SpecialGrid';
import { 
  getVideoSpecialLayout, 
  getVideoGridColumns, 
  DEFAULT_EMPTY_MESSAGE 
} from '../config/specialGridConfig';

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
  // 設定から特別レイアウトとグリッド設定を取得
  const specialLayout = getVideoSpecialLayout();
  const gridColumns = getVideoGridColumns();
  
  // 通常アイテムのレンダラー
  const renderNormalItem = (video: VideoDto, index: number) => (
    <VideoCard key={video.id} video={video} index={index} />
  );
  
  // 特別アイテムのレンダラー
  const renderSpecialItem = (video: VideoDto, index: number, type: SpecialItemType) => {
    switch (type) {
      case 'featured':
        return <FeaturedVideoCard key={video.id} video={video} index={index} />;
      case 'pickup':
        return <PickupVideoCard key={video.id} video={video} index={index} />;
      default:
        return renderNormalItem(video, index);
    }
  };
  
  // スケルトンのレンダラー
  const renderSkeleton = (index: number) => (
    <SkeletonCard index={index} />
  );
  
  return (
    <SpecialGrid
      items={videos}
      loading={loading}
      error={error}
      enableSpecialLayout={showFeatured && isFirstPage}
      specialLayout={specialLayout}
      gridColumns={gridColumns}
      renderNormalItem={renderNormalItem}
      renderSpecialItem={renderSpecialItem}
      renderSkeleton={renderSkeleton}
      emptyMessage={DEFAULT_EMPTY_MESSAGE.videos}
    />
  );
};