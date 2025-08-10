'use client';

import React from 'react';
import { SearchResultsSummary as BaseSearchResultsSummary } from '@/components/common/SearchResultsSummary';
import { NewsFilterOptions } from '../types/types';
import { useNewsCategories } from '../hooks/useNewsCategories';
import {getCategoryDisplayName} from "@/constants/newsCategories";

interface NewsSearchResultsSummaryProps {
  searchQuery: string;
  filters: NewsFilterOptions;
  totalCount: number;
  onClearAllFilters: () => void;
}

export const NewsSearchResultsSummary = ({
  searchQuery,
  filters,
  totalCount,
  onClearAllFilters
}: NewsSearchResultsSummaryProps) => {
  const { categories } = useNewsCategories();
  
  const hasFilters = Boolean(searchQuery.trim()) || Boolean(filters.categoryIds && filters.categoryIds.length > 0);
  
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return null;
    const category = categories.find(c => c.id === categoryId);
    return category ? getCategoryDisplayName(category.name) : '';
  };

  const categoryNames = filters.categoryIds?.map(getCategoryName).filter(Boolean).join(', ');
  const filterSummary = categoryNames ? `カテゴリ: ${categoryNames}` : undefined;

  return (
    <BaseSearchResultsSummary
      searchQuery={searchQuery}
      filterSummary={filterSummary}
      totalCount={totalCount}
      onClearAllFilters={onClearAllFilters}
      hasFilters={hasFilters}
    />
  );
};
