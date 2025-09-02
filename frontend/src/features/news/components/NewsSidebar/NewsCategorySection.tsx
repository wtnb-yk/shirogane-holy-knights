'use client';

import React from 'react';
import { NewsFilterOptions } from '../../types/types';
import { useNewsCategories } from '../../hooks/useNewsCategories';
import { getCategoryDisplayName } from '@/constants/newsCategories';

interface NewsCategorySectionProps {
  filters: NewsFilterOptions;
  onFiltersChange: (filters: NewsFilterOptions) => void;
}

export const NewsCategorySection = ({ 
  filters, 
  onFiltersChange 
}: NewsCategorySectionProps) => {
  const { categories, loading } = useNewsCategories();
  const selectedCategoryIds = filters.categoryIds || [];

  const handleCategoryToggle = (categoryId: number) => {
    if (selectedCategoryIds.includes(categoryId)) {
      // 同じカテゴリをクリックした場合は選択解除（全て状態に戻る）
      onFiltersChange({
        ...filters,
        categoryIds: undefined,
      });
    } else {
      // 異なるカテゴリをクリックした場合は、そのカテゴリのみを選択
      onFiltersChange({
        ...filters,
        categoryIds: [categoryId],
      });
    }
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      categoryIds: undefined,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900">カテゴリ</h3>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-8 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-gray-900">カテゴリ</h3>
      
      <div className="space-y-2">
        {/* 全てクリアボタン */}
        <button
          onClick={handleClearAll}
          className={`w-full py-2 px-3 rounded-md text-sm transition-all text-left ${
            selectedCategoryIds.length === 0
              ? 'bg-amber-100 text-amber-800 font-semibold'
              : 'text-gray-600 hover:bg-amber-50 hover:pl-4'
          }`}
        >
          全て
        </button>

        {/* カテゴリボタン */}
        {categories.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`w-full py-2 px-3 rounded-md text-sm transition-all text-left ${
                isSelected
                  ? 'bg-amber-100 text-amber-800 font-semibold'
                  : 'text-gray-600 hover:bg-amber-50 hover:pl-4'
              }`}
            >
              {getCategoryDisplayName(category.name)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
