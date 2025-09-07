'use client';

import React from 'react';
import { getCategoryDisplayName } from '@/constants/newsCategories';

interface Category {
  id: number;
  name: string;
}

interface CategoryBadgesProps {
  categories: Category[];
  selectedCategoryIds: number[];
  onCategoryToggle: (categoryId: number) => void;
}

export const CategoryBadges = ({ 
  categories, 
  selectedCategoryIds, 
  onCategoryToggle 
}: CategoryBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selectedCategoryIds.includes(category.id);
        return (
          <span
            key={category.id}
            onClick={() => onCategoryToggle(category.id)}
            className={`
              px-2 py-1 text-xs rounded cursor-pointer transition-all
              ${isSelected
                ? 'bg-accent-gold text-bg-primary font-medium'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-secondary'
              }
            `}
          >
            {getCategoryDisplayName(category.name)}
          </span>
        );
      })}
    </div>
  );
};