'use client';

import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
  title?: string;
}

export const CategoryFilter = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll,
  title = 'タグ'
}: CategoryFilterProps) => {
  const allCategories = ['すべて', ...categories];

  const handleItemClick = (category: string) => {
    if (category === 'すべて') {
      onClearAll();
    } else {
      onCategoryToggle(category);
    }
  };

  const isSelected = (category: string) => {
    if (category === 'すべて') {
      return selectedCategories.length === 0;
    }
    return selectedCategories.includes(category);
  };

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <ul className="space-y-1">
        {allCategories.map((category) => (
          <li key={category}>
            <button
              onClick={() => handleItemClick(category)}
              className={`w-full text-left py-2 px-3 rounded-md text-sm transition-all ${
                isSelected(category)
                  ? 'bg-amber-100 text-amber-800 font-semibold'
                  : 'text-gray-600 hover:bg-amber-50 hover:pl-4'
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
