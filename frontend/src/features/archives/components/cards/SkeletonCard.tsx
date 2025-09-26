'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { StaggeredItem } from '@/components/ui/StaggeredItem';

interface SkeletonCardProps {
  index: number;
}

export const SkeletonCard = ({ index }: SkeletonCardProps) => {
  return (
    <StaggeredItem index={index} className="group">
      <div className="rounded-lg overflow-hidden h-full">
        <div className="relative w-full aspect-video overflow-hidden bg-bg-accent">
          <Skeleton className="w-full h-full bg-bg-accent" />
        </div>
      </div>
    </StaggeredItem>
  );
};