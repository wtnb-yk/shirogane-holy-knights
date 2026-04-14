'use client';

import React from 'react';
import { Card } from '@/components/Card/card';
import { Skeleton } from '@/components/Loading/skeleton';
import { StaggeredItem } from '@/components/Card/StaggeredItem';

interface SkeletonNewsPreviewCardProps {
  index: number;
}

const SkeletonNewsPreviewCardComponent = ({ index }: SkeletonNewsPreviewCardProps) => {
  return (
    <StaggeredItem index={index}>
      <Card className="h-full overflow-hidden bg-bg-primary border-0 shadow-sm">
        <div className="flex flex-col h-full">
          {/* 画像部分 */}
          <div className="relative aspect-video w-full bg-bg-accent">
            <Skeleton className="w-full h-full rounded-t-lg" />
          </div>
          
          {/* コンテンツ部分 */}
          <div className="flex-1 p-4 flex flex-col">
            {/* カテゴリ */}
            <div className="mb-2">
              <Skeleton className="h-5 w-16" />
            </div>
            
            {/* タイトル */}
            <div className="mb-2 flex-1">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* 日付 */}
            <div className="mt-auto">
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </Card>
    </StaggeredItem>
  );
};

SkeletonNewsPreviewCardComponent.displayName = 'SkeletonNewsPreviewCard';

export const SkeletonNewsPreviewCard = React.memo(SkeletonNewsPreviewCardComponent);