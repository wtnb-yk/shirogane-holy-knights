'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonNewsCardProps {
  index: number;
}

const SkeletonNewsCardComponent = ({ index }: SkeletonNewsCardProps) => {
  return (
    <div 
      className="opacity-0 animate-fade-in" 
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <Card className="overflow-hidden bg-white border-0">
        <div className="flex flex-col sm:flex-row">
          {/* 画像部分 */}
          <div className="relative w-full sm:w-72 h-40 sm:h-[162px] flex-shrink-0 bg-sage-100">
            <Skeleton className="w-full h-full" />
          </div>
          
          {/* コンテンツ部分 */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              {/* カテゴリとメタ情報 */}
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              
              {/* タイトル */}
              <div className="mb-2">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              {/* 要約 */}
              <div className="mb-3">
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
            
            {/* フッター */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

SkeletonNewsCardComponent.displayName = 'SkeletonNewsCard';

export const SkeletonNewsCard = React.memo(SkeletonNewsCardComponent);