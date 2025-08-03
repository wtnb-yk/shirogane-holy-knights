'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useNewsDetail } from '@/features/news/hooks/useNewsDetail';
import { NewsDetail } from '@/features/news/components/NewsDetail';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { news, loading, error } = useNewsDetail(params.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* パンくずリスト */}
          <div className="mb-6">
            <Skeleton className="h-4 w-48" />
          </div>

          {/* 戻るボタン */}
          <div className="mb-6">
            <Skeleton className="h-6 w-24" />
          </div>

          {/* メインコンテンツ */}
          <div className="bg-white border border-sage-200 rounded-lg overflow-hidden">
            {/* サムネイル */}
            <Skeleton className="w-full h-64 md:h-80" />
            
            <div className="p-6 md:p-8">
              {/* カテゴリと日付 */}
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* タイトル */}
              <div className="mb-6">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-3/4" />
              </div>

              {/* 本文 */}
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    if (error?.includes('見つかりませんでした')) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">エラーが発生しました</div>
              <div className="text-gray-600 text-sm">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <NewsDetail news={news} />
      </div>
    </div>
  );
}