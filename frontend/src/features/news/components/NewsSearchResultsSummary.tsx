'use client';

import React from 'react';
import { X } from 'lucide-react';
import { NewsFilterOptions } from '../types/types';
import { useNewsCategories } from '../hooks/useNewsCategories';

interface NewsSearchResultsSummaryProps {
  searchQuery: string;
  filters: NewsFilterOptions;
  totalCount: number;
  onClearAllFilters: () => void;
}

export const NewsSearchResultsSummary = ({
  searchQuery,
  filters,
  totalCount,
  onClearAllFilters
}: NewsSearchResultsSummaryProps) => {
  const { categories } = useNewsCategories();
  
  const hasFilters = searchQuery.trim() || filters.categoryId;
  
  if (!hasFilters) return null;

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return null;
    const category = categories.find(c => c.id === categoryId);
    return category?.displayName || '';
  };

  const categoryName = getCategoryName(filters.categoryId);

  return (
    <div className="mb-6 p-4 bg-sage-100/30 border border-sage-200/50 rounded-lg opacity-0 animate-slide-up" style={{ animationDelay: '175ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">
            {searchQuery && `「${searchQuery}」`}
            {searchQuery && categoryName && ' / '}
            {categoryName && `カテゴリ: ${categoryName}`}
            の検索結果: <span className="font-medium">{totalCount.toLocaleString()}件</span>
          </span>
        </div>
        
        <button
          onClick={onClearAllFilters}
          className="flex items-center gap-1 px-3 py-1 text-xs text-sage-300 hover:text-gray-800 bg-white border border-sage-200 rounded-md hover:bg-sage-100 transition-all duration-200"
        >
          <X className="w-3 h-3" />
          クリア
        </button>
      </div>
    </div>
  );
};