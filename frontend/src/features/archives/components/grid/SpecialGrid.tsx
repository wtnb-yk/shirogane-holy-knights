'use client';

import React from 'react';
import { BaseGrid } from '@/components/common/BaseGrid';
import { SpecialGridProps } from '../../types/specialGridTypes';
import { 
  generateGridClassName, 
  isSpecialItem, 
  shouldSkipItem 
} from '../../utils/gridLayoutCalculator';

/**
 * 特別表示対応のグリッドコンポーネント
 * VideosGrid/StreamsGridの共通ロジックを抽象化
 */
export function SpecialGrid<T>({
  items,
  loading,
  error,
  enableSpecialLayout,
  specialLayout,
  gridColumns,
  renderNormalItem,
  renderSpecialItem,
  renderSkeleton,
  emptyMessage,
  skeletonCount = 8
}: SpecialGridProps<T>) {
  
  // 特別レイアウトの適用条件
  if (!loading && !error && enableSpecialLayout && items.length > 0) {
    const gridClassName = generateGridClassName(gridColumns);
    
    return (
      <div className="mb-8">
        <div 
          className={`${gridClassName} gap-0.5 rounded-lg overflow-hidden opacity-0 animate-slide-up`}
          style={{ animationDelay: '200ms' }}
        >
          {items.map((item, index) => {
            // 特別アイテムかどうかをチェック
            const specialItemConfig = isSpecialItem(index, specialLayout.specialItems);
            if (specialItemConfig) {
              return renderSpecialItem(item, index, specialItemConfig.type);
            }
            
            // スキップ対象かどうかをチェック
            if (shouldSkipItem(index, specialLayout.skipIndices)) {
              return null;
            }
            
            // 通常アイテム
            const normalItem = renderNormalItem(item, index);
            return normalItem || null;
          })}
        </div>
      </div>
    );
  }
  
  // 通常の表示（BaseGridにフォールバック）
  const baseGridClassName = generateGridClassName(gridColumns);
  
  return (
    <BaseGrid
      items={items}
      loading={loading}
      error={error || null}
      renderItem={(item, index) => renderNormalItem(item, index) || null}
      renderSkeleton={renderSkeleton}
      emptyMessage={emptyMessage}
      skeletonCount={skeletonCount}
      gridClassName={baseGridClassName.replace('grid ', '')}
    />
  );
}

SpecialGrid.displayName = 'SpecialGrid';
