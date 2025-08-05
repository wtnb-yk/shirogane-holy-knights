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

  const handleCategoryChange = (categoryId?: number) => {
    onFiltersChange({
      ...filters,
      categoryId,
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
        {/* 全てカテゴリ */}
        <button
          onClick={() => handleCategoryChange(undefined)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            filters.categoryId === undefined
              ? 'bg-sage-300 text-white shadow-md'
              : 'bg-white text-sage-300 border border-sage-200 hover:bg-sage-100'
          }`}
        >
          全て
        </button>

        {/* カテゴリボタン */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              filters.categoryId === category.id
                ? 'bg-sage-300 text-white shadow-md'
                : 'bg-white text-sage-300 border border-sage-200 hover:bg-sage-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};