import React from 'react';
import { Skeleton } from '@/components/Loading/skeleton';
import { Card, CardContent } from '@/components/Card/card';

export function SkeletonSongCard() {
  return (
    <Card className="rounded-lg overflow-hidden animate-pulse">
      <CardContent className="p-0">
        {/* サムネイル */}
        <Skeleton className="aspect-video w-full" />

        {/* テキスト情報 */}
        <div className="p-4 space-y-2">
          {/* タイトル（2行） */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* アーティスト */}
          <Skeleton className="h-3 w-1/2" />

          {/* 統計情報 */}
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}