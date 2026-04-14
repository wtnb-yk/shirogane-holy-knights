'use client';

import React from 'react';
import { StreamDto } from '../../types/types';
import { SpecialItemType } from '../../types/specialGridTypes';
import { StreamCard } from '../cards/StreamCard';
import { SkeletonCard } from '../cards/SkeletonCard';
import { SpecialGrid } from './internals/SpecialGrid';
import { 
  getStreamSpecialLayout, 
  getStreamGridColumns, 
  DEFAULT_EMPTY_MESSAGE 
} from '../../config/gridConfig';

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
        return <StreamCard key={stream.id} stream={stream} index={index} variant="featured" />;
      case 'pickup':
        return <StreamCard key={stream.id} stream={stream} index={index} variant="pickup" />;
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
