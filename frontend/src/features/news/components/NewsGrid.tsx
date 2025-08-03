'use client';

import React from 'react';
import { NewsDto } from '../types/types';
import { NewsCard } from './NewsCard';
import { SkeletonNewsCard } from './SkeletonNewsCard';

interface NewsGridProps {
  news: NewsDto[];
  loading: boolean;
  error: string | null;
}

export const NewsGrid = ({ news, loading, error }: NewsGridProps) => {
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">エラーが発生しました</div>
          <div className="text-gray-600 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonNewsCard key={index} index={index} />
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="text-center">
          <div className="text-gray-500 text-lg font-medium mb-2">ニュースが見つかりませんでした</div>
          <div className="text-gray-400 text-sm">検索条件を変更してお試しください</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 opacity-0 animate-slide-up" style={{ animationDelay: '200ms' }}>
      {news.map((newsItem, index) => (
        <NewsCard 
          key={newsItem.id} 
          news={newsItem} 
          index={index} 
        />
      ))}
    </div>
  );
};