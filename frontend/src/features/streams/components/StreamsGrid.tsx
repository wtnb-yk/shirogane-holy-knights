'use client';

import React from 'react';
import { StreamDto } from '../types/types';
import { SpecialItemType } from '../types/specialGridTypes';
import { StreamCard } from './StreamCard';
import { FeaturedStreamCard } from './FeaturedStreamCard';
import { PickupStreamCard } from './PickupStreamCard';
import { SkeletonCard } from './SkeletonCard';
import { SpecialGrid } from './grid/SpecialGrid';
import { 
  getStreamSpecialLayout, 
  getStreamGridColumns, 
  DEFAULT_EMPTY_MESSAGE 
} from '../config/specialGridConfig';

interface StreamsGridProps {
  streams: StreamDto[];
  loading: boolean;
  error?: string | null;
  showFeatured?: boolean;
  isFirstPage?: boolean;
}

export const StreamsGrid = ({ 
  streams, 
  loading, 
  error, 
  showFeatured = false, 
  isFirstPage = false 
}: StreamsGridProps) => {
  // 設定から特別レイアウトとグリッド設定を取得
  const specialLayout = getStreamSpecialLayout();
  const gridColumns = getStreamGridColumns();
  
  // 通常アイテムのレンダラー
  const renderNormalItem = (stream: StreamDto, index: number) => (
    <StreamCard key={stream.id} stream={stream} index={index} />
  );
  
  // 特別アイテムのレンダラー
  const renderSpecialItem = (stream: StreamDto, index: number, type: SpecialItemType) => {
    switch (type) {
      case 'featured':
        return <FeaturedStreamCard key={stream.id} stream={stream} index={index} />;
      case 'pickup':
        return <PickupStreamCard key={stream.id} stream={stream} index={index} />;
      default:
        return renderNormalItem(stream, index);
    }
  };
  
  // スケルトンのレンダラー
  const renderSkeleton = (index: number) => (
    <SkeletonCard index={index} />
  );
  
  return (
    <SpecialGrid
      items={streams}
      loading={loading}
      error={error}
      enableSpecialLayout={showFeatured && isFirstPage}
      specialLayout={specialLayout}
      gridColumns={gridColumns}
      renderNormalItem={renderNormalItem}
      renderSpecialItem={renderSpecialItem}
      renderSkeleton={renderSkeleton}
      emptyMessage={DEFAULT_EMPTY_MESSAGE.streams}
    />
  );
};