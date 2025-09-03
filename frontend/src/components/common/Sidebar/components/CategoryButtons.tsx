'use client';

import React from 'react';

interface CategoryButtonsProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
  clearAllLabel?: string;
}

export const CategoryButtons = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll,
  clearAllLabel = "全て"
}: CategoryButtonsProps) => {
  return (
    <div className="space-y-2">
      {/* 全てクリアボタン */}
      <button
        onClick={onClearAll}
        className={`w-full py-2.5 px-3 rounded-lg text-sm transition-all text-left ${
          selectedCategories.length === 0
            ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
            : 'text-text-secondary hover:bg-bg-secondary'
        }`}
      >
        {clearAllLabel}
      </button>

      {/* カテゴリボタン */}
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`w-full py-2.5 px-3 rounded-lg text-sm transition-all text-left ${
              isSelected
                ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
                : 'text-text-secondary hover:bg-bg-secondary'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};