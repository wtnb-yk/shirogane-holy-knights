'use client';

import React from 'react';
import { Card } from '@/components/Card/card';
import { Skeleton } from '@/components/Loading/skeleton';
import { StaggeredItem } from '@/components/Card/StaggeredItem';

interface SkeletonSpecialEventCardProps {
  index: number;
}

const SkeletonSpecialEventCardComponent = ({ index }: SkeletonSpecialEventCardProps) => {
  return (
    <StaggeredItem index={index}>
      <Card className="bg-bg-primary border-0 p-6">
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />

          <div className="mb-4">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </Card>
    </StaggeredItem>
  );
};

SkeletonSpecialEventCardComponent.displayName = 'SkeletonSpecialEventCard';

export const SkeletonSpecialEventCard = React.memo(SkeletonSpecialEventCardComponent);
