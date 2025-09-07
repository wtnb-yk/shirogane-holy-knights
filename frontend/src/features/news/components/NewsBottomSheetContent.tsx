'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { NewsFilterOptions } from '@/features/news/types/types';
import { useNewsCategories } from '@/features/news/hooks/useNewsCategories';
import { CategoryBadges } from './CategoryBadges';

interface NewsBottomSheetContentProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: NewsFilterOptions;
  setFilters: (filters: NewsFilterOptions) => void;
}

export const NewsBottomSheetContent = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters
}: NewsBottomSheetContentProps) => {
  const [inputValue, setInputValue] = React.useState(searchValue);
  const { categories, loading } = useNewsCategories();
  const selectedCategoryIds = filters.categoryIds || [];

  React.useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!value) {
      onClearSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onClearSearch();
  };

  const handleCategoryToggle = (categoryId: number) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setFilters({
        ...filters,
        categoryIds: undefined,
      });
    } else {
      setFilters({
        ...filters,
        categoryIds: [categoryId],
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-3">
        <div className="space-y-6">
          {/* ニュース検索セクション */}
          <div>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-text-tertiary w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="気になるニュースを探す"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 border border-surface-border rounded-md text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* カテゴリ */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-2">カテゴリ</h3>
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-16 bg-bg-tertiary rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <CategoryBadges
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                onCategoryToggle={handleCategoryToggle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};