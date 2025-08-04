'use client';

import React from 'react';
import { BaseSkeleton } from '@/components/common/BaseSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
  index: number;
}

export const SkeletonCard = ({ index }: SkeletonCardProps) => {
  return (
    <BaseSkeleton
      index={index}
      contentSlots={[
        <Skeleton key="title" className="h-6 w-3/4 mb-3 bg-sage-100" />,
        <Skeleton key="date" className="h-4 w-1/2 mb-3 bg-sage-100" />,
        <div key="tags" className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-sage-100" />
          <Skeleton className="h-6 w-16 bg-sage-100" />
          <Skeleton className="h-6 w-16 bg-sage-100" />
        </div>
      ]}
      footerSlots={[
        <Skeleton key="link" className="h-5 w-32 bg-sage-100" />
      ]}
    />
  );
};