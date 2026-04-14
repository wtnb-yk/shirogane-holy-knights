'use client';

import React from 'react';
import { Card } from '@/components/Card/card';
import { Skeleton } from '@/components/Loading/skeleton';
import { StaggeredItem } from '@/components/Card/StaggeredItem';

interface SkeletonDiscographyCardProps {
  index: number;
}

const SkeletonDiscographyCardComponent = ({ index }: SkeletonDiscographyCardProps) => {
  return (
    <StaggeredItem index={index}>
      <Card className="overflow-hidden bg-bg-primary border-0">
        {/* カバー画像部分 */}
        <div className="aspect-square relative mb-3">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>

        {/* アルバム情報部分 */}
        <div className="p-4">
          {/* カテゴリバッジ */}
          <div className="mb-2">
            <Skeleton className="h-4 w-16" />
          </div>

          {/* タイトル */}
          <div className="mb-1">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* アーティスト */}
          <div className="mb-2">
            <Skeleton className="h-3 w-2/3" />
          </div>

          {/* リリース日 */}
          <div className="mb-2">
            <Skeleton className="h-3 w-1/2" />
          </div>

          {/* トラック数 */}
          <div>
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      </Card>
    </StaggeredItem>
  );
};

SkeletonDiscographyCardComponent.displayName = 'SkeletonDiscographyCard';

export const SkeletonDiscographyCard = React.memo(SkeletonDiscographyCardComponent);
