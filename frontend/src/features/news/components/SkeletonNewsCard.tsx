'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonNewsCardProps {
  index: number;
}

const SkeletonNewsCardComponent = ({ index }: SkeletonNewsCardProps) => {
  return (
    <div 
      className="h-full opacity-0 animate-fade-in" 
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <Card className="h-full overflow-hidden bg-white border border-sage-200">
        {/* サムネイル部分 */}
        <div className="relative w-full h-48 bg-sage-100">
          <Skeleton className="w-full h-full" />
        </div>
        
        <CardContent className="p-5">
          {/* カテゴリバッジと日付 */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          
          {/* タイトル */}
          <div className="mb-3">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          
          {/* サマリー */}
          <div className="mb-3">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </CardFooter>
      </Card>
    </div>
  );
};

SkeletonNewsCardComponent.displayName = 'SkeletonNewsCard';

export const SkeletonNewsCard = React.memo(SkeletonNewsCardComponent);