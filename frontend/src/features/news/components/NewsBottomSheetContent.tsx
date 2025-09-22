'use client';

import React from 'react';
import { NewsFilterOptions } from '@/features/news/types/types';
import { useNewsCategories } from '@/features/news/hooks/useNewsCategories';
import { TagBadges } from '@/components/common/Sidebar/TagBadges';
import { getCategoryDisplayName } from '@/constants/newsCategories';
import { SearchInput } from '@/components/ui/SearchInput';

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
  const { categories, loading } = useNewsCategories();
  const selectedCategoryIds = filters.categoryIds || [];

  const handleSearchChange = (value: string) => {
    if (!value) {
      onClearSearch();
    }
  };

  const handleTagToggle = (tag: string) => {
    const categoryId = categories.find(c => getCategoryDisplayName(c.name) === tag)?.id;
    if (!categoryId) return;

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

  const tags = categories.map(c => getCategoryDisplayName(c.name));
  const selectedTags = categories
    .filter(c => selectedCategoryIds.includes(c.id))
    .map(c => getCategoryDisplayName(c.name));

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-3">
        <div className="space-y-6">
          {/* ニュース検索セクション */}
          <div>
            <SearchInput
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              onSearch={onSearch}
              onClearSearch={onClearSearch}
              placeholder="気になるニュースを探す"
              variant="sidebar"
              size="sm"
            />
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
              <TagBadges
                tags={tags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};