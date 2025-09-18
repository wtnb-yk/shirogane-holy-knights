'use client';

import React from 'react';
import { NewsFilterOptions } from '@/features/news/types/types';
import { useNewsCategories } from '@/features/news/hooks/useNewsCategories';
import { getCategoryDisplayName } from '@/constants/newsCategories';
import { SearchInput } from '@/components/ui/SearchInput';
import { CategoryButtons } from './components/CategoryButtons';

interface MobileDropdownNewsSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: NewsFilterOptions;
  setFilters: (filters: NewsFilterOptions) => void;
}

export const MobileDropdownNewsSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters
}: MobileDropdownNewsSectionProps) => {
  const { categories, loading } = useNewsCategories();
  const selectedCategoryIds = filters.categoryIds || [];

  const handleCategoryToggle = (categoryId: string) => {
    const id = parseInt(categoryId);
    if (selectedCategoryIds.includes(id)) {
      const { categoryIds, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      setFilters({
        ...filters,
        categoryIds: [id],
      });
    }
  };

  const handleClearAll = () => {
    const { categoryIds, ...restFilters } = filters;
    setFilters(restFilters);
  };

  return (
    <div className="space-y-6">
      {/* 検索セクション */}
      <SearchInput
        searchValue={searchValue}
        onSearchChange={(value) => {
          if (!value) {
            onClearSearch();
          }
        }}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        placeholder="気になるニュースを探す"
        variant="compact"
        size="sm"
      />

      {/* カテゴリセクション */}
      <div className="border-t border-surface-border pt-6">
        <h4 className="text-sm font-semibold text-text-primary mb-4">カテゴリ</h4>
        
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-10 bg-bg-tertiary rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <CategoryButtons
            categories={categories.map(c => getCategoryDisplayName(c.name))}
            selectedCategories={categories.filter(c => selectedCategoryIds.includes(c.id)).map(c => getCategoryDisplayName(c.name))}
            onCategoryToggle={(categoryName) => {
              const category = categories.find(c => getCategoryDisplayName(c.name) === categoryName);
              if (category) handleCategoryToggle(category.id.toString());
            }}
            onClearAll={handleClearAll}
          />
        )}
      </div>
    </div>
  );
};