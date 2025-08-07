'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BaseSkeletonProps {
  index: number;
  showThumbnail?: boolean;
  thumbnailHeight?: string;
  contentSlots?: React.ReactNode[];
  footerSlots?: React.ReactNode[];
}

export const BaseSkeleton = ({ 
  index, 
  showThumbnail = true,
  thumbnailHeight = 'h-48',
  contentSlots = [
    <Skeleton key="title-1" className="h-5 w-full mb-2" />,
    <Skeleton key="title-2" className="h-5 w-3/4" />
  ],
  footerSlots = [
    <Skeleton key="footer" className="h-4 w-20" />
  ]
}: BaseSkeletonProps) => {
  return (
    <div 
      className="h-full opacity-0 animate-fade-in" 
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <Card className="h-full overflow-hidden bg-shirogane-bg-primary border border-shirogane-surface-border">
        {showThumbnail && (
          <div className={`relative w-full ${thumbnailHeight} bg-shirogane-bg-accent`}>
            <Skeleton className="w-full h-full" />
          </div>
        )}
        
        <CardContent className="p-5">
          {contentSlots}
        </CardContent>
        
        {footerSlots.length > 0 && (
          <CardFooter className="p-5 pt-0 flex justify-between items-center">
            {footerSlots}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};