// 'use client';

import React from 'react';
import { NewsFilterOptions } from '../types/types';
import { useNewsCategories } from '../hooks/useNewsCategories';

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
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-shirogane-bg-accent rounded-full animate-pulse h-9 w-20"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
      <div className="flex flex-wrap gap-2">
        {/* 全てクリアボタン */}
        <button
          onClick={handleClearAll}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            selectedCategoryIds.length === 0
              ? 'bg-shirogane-text-secondary text-white shadow-md'
              : 'bg-white text-shirogane-text-secondary border border-shirogane-surface-border hover:bg-shirogane-bg-accent'
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
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-shirogane-text-secondary text-white shadow-md ring-2 ring-shirogane-surface-border'
                  : 'bg-white text-shirogane-text-secondary border border-shirogane-surface-border hover:bg-shirogane-bg-accent'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
