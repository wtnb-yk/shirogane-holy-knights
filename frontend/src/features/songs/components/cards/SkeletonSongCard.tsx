import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function SkeletonSongCard() {
  return (
    <Card className="rounded-lg overflow-hidden h-full animate-pulse">
      <CardContent className="p-4 md:p-5 h-full flex flex-col">
        {/* ヘッダー部分 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* パフォーマンス情報 */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* パフォーマンス数インジケーター */}
        <div className="mt-2 text-center">
          <Skeleton className="h-4 w-24 rounded-full mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}