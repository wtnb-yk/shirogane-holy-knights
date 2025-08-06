'use client';

import React from 'react';
import { NewsCategoryDto, NewsFilterOptions } from '../types/types';
import { useNewsCategories } from '../hooks/useNewsCategories';

interface NewsCategoryFilterProps {
  filters: NewsFilterOptions;
  onFiltersChange: (filters: NewsFilterOptions) => void;
}

export const NewsCategoryFilter = ({ filters, onFiltersChange }: NewsCategoryFilterProps) => {
  const { categories, loading } = useNewsCategories();

  // 現在選択されているカテゴリIDs（後方互換性対応）
  const selectedCategoryIds = filters.categoryIds || (filters.categoryId ? [filters.categoryId] : []);

  const handleCategoryToggle = (categoryId: number) => {
    const newCategoryIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId) // 選択解除
      : [...selectedCategoryIds, categoryId]; // 選択追加
    
    onFiltersChange({
      ...filters,
      categoryIds: newCategoryIds.length > 0 ? newCategoryIds : undefined,
      categoryId: undefined, // 新形式使用時は旧形式をクリア
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      categoryIds: undefined,
      categoryId: undefined,
    });
  };

  if (loading) {
    return (
      <div className="mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="px-4 py-2 bg-sage-100 rounded-full animate-pulse h-9 w-20"
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
              ? 'bg-sage-300 text-white shadow-md'
              : 'bg-white text-sage-300 border border-sage-200 hover:bg-sage-100'
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
                  ? 'bg-sage-300 text-white shadow-md ring-2 ring-sage-200'
                  : 'bg-white text-sage-300 border border-sage-200 hover:bg-sage-100'
              }`}
            >
              {category.name}
              {isSelected && <span className="ml-1 text-xs">✓</span>}
            </button>
          );
        })}
        
        {/* 選択済みカテゴリ数の表示 */}
        {selectedCategoryIds.length > 0 && (
          <div className="flex items-center px-3 py-2 bg-sage-100 rounded-full text-xs text-sage-600">
            {selectedCategoryIds.length}件選択中
          </div>
        )}
      </div>
    </div>
  );
};