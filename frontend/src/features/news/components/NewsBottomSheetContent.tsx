'use client';

import React from 'react';
import { NewsFilterOptions } from '@/features/news/types/types';
import { useNewsCategories } from '@/features/news/hooks/useNewsCategories';
import { MultiSelectSection } from '@/components/common/MultiSelectSection';
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

  const handleTagChange = (tags: string[]) => {
    if (tags.length === 0) {
      setFilters({
        ...filters,
        categoryIds: undefined,
      });
    } else {
      const categoryIds = tags.map(tag => {
        return categories.find(c => getCategoryDisplayName(c.name) === tag)?.id;
      }).filter(Boolean) as number[];

      setFilters({
        ...filters,
        categoryIds,
      });
    }
  };

  const tags = categories.map(c => getCategoryDisplayName(c.name));
  const selectedTags = categories
    .filter(c => selectedCategoryIds.includes(c.id))
    .map(c => getCategoryDisplayName(c.name));

  return (
    <>
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
      <MultiSelectSection
        options={tags}
        value={selectedTags}
        onChange={handleTagChange}
        title="カテゴリ"
        placeholder="カテゴリを選択"
        loading={loading}
      />
    </>
  );
};