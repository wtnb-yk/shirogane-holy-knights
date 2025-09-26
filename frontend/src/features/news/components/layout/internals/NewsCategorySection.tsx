'use client';

import React from 'react';
import { NewsFilterOptions } from '../../../types/types';
import { useNewsCategories } from '../../../hooks/useNewsCategories';
import { getCategoryDisplayName } from '@/constants/newsCategories';
import { SelectableList } from '@/components/common/SelectableList';
import { NewsCategoryDto } from '../../../types/types';

interface NewsCategorySectionProps {
  filters: NewsFilterOptions;
  onFiltersChange: (filters: NewsFilterOptions) => void;
}

export const NewsCategorySection = ({
  filters,
  onFiltersChange
}: NewsCategorySectionProps) => {
  const { categories, loading } = useNewsCategories();
  const selectedCategoryIds = filters.categoryIds || [];

  const handleCategoryToggle = (category: NewsCategoryDto) => {
    if (selectedCategoryIds.includes(category.id)) {
      // 同じカテゴリをクリックした場合は選択解除（全て状態に戻る）
      onFiltersChange({
        ...filters,
        categoryIds: undefined,
      });
    } else {
      // 異なるカテゴリをクリックした場合は、そのカテゴリのみを選択
      onFiltersChange({
        ...filters,
        categoryIds: [category.id],
      });
    }
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      categoryIds: undefined,
    });
  };

  // 選択されたカテゴリオブジェクトを取得
  const selectedCategories = categories.filter(category =>
    selectedCategoryIds.includes(category.id)
  );

  return (
    <SelectableList<NewsCategoryDto>
      title="カテゴリ"
      items={categories}
      selectedItems={selectedCategories}
      onItemToggle={handleCategoryToggle}
      onClearAll={handleClearAll}
      getDisplayName={(category) => getCategoryDisplayName(category.name)}
      getItemKey={(category) => category.id}
      allOptionLabel="全て"
      loading={loading}
      className="space-y-4"
    />
  );
};
