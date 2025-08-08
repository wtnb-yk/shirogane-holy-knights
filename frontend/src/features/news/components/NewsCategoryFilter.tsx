// 'use client';

import React from 'react';
import { NewsFilterOptions } from '../types/types';
import { useNewsCategories } from '../hooks/useNewsCategories';
import { getCategoryDisplayName } from '@/constants/newsCategories';
import { getCategoryButtonStyle } from '../utils/categoryStyles';

interface NewsCategoryFilterProps {
  filters: NewsFilterOptions;
  onFiltersChange: (filters: NewsFilterOptions) => void;
}

export const NewsCategoryFilter = ({ filters, onFiltersChange }: NewsCategoryFilterProps) => {
  const { categories, loading } = useNewsCategories();

  const selectedCategoryIds = filters.categoryIds || [];

  const handleCategoryToggle = (categoryId: number) => {
    const newCategoryIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId) // 選択解除
      : [...selectedCategoryIds, categoryId]; // 選択追加
    
    onFiltersChange({
      ...filters,
      categoryIds: newCategoryIds.length > 0 ? newCategoryIds : undefined,
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      categoryIds: undefined,
    });
  };

  if (loading) {
    return (
      <div className="mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-bg-accent rounded-full animate-pulse h-9 w-20"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* 全てクリアボタン */}
        <button
          onClick={handleClearAll}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            selectedCategoryIds.length === 0
              ? 'bg-text-secondary text-white shadow-md'
              : 'bg-bg-primary text-text-secondary border border-surface-border hover:bg-bg-accent'
          }`}
        >
          全て
        </button>

        {/* カテゴリボタン（複数選択対応） */}
        {categories.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={getCategoryButtonStyle(category.name, isSelected)}
            >
              {getCategoryDisplayName(category.name)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
