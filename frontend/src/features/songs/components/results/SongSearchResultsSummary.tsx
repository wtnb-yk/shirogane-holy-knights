'use client';

import React from 'react';
import { SearchResultsSummary } from '@/components/Stats/SearchResultsSummary';
import { SongFilterOptions, SearchTarget, SingFrequencyCategory } from '@/features/songs/types/types';

interface SongSearchResultsSummaryProps {
  searchQuery: string;
  searchTarget?: SearchTarget;
  totalCount: number;
  filters: SongFilterOptions;
  onClearAllFilters: () => void;
}

const FREQUENCY_LABELS = {
  [SingFrequencyCategory.LOW]: '1-2回',
  [SingFrequencyCategory.MEDIUM]: '3-5回',
  [SingFrequencyCategory.HIGH]: '6-10回',
  [SingFrequencyCategory.VERY_HIGH]: '11回以上'
};

const SEARCH_TARGET_LABELS = {
  [SearchTarget.ALL]: '楽曲名・アーティスト名',
  [SearchTarget.TITLE]: '楽曲名のみ',
  [SearchTarget.ARTIST]: 'アーティスト名のみ'
};

export const SongSearchResultsSummary = ({
  searchQuery,
  searchTarget = SearchTarget.ALL,
  totalCount,
  filters,
  onClearAllFilters
}: SongSearchResultsSummaryProps) => {
  // フィルターサマリー生成
  const filterParts: string[] = [];
  if (searchTarget !== SearchTarget.ALL) {
    filterParts.push(`検索対象: ${SEARCH_TARGET_LABELS[searchTarget]}`);
  }
  if (filters.frequencyCategories?.length) {
    const frequencies = filters.frequencyCategories
      .map(cat => FREQUENCY_LABELS[cat]).join(', ');
    filterParts.push(`歌唱回数: ${frequencies}`);
  }
  const filterSummary = filterParts.join(' / ');

  // 基底コンポーネント用filters変換
  const baseFilters = {
    selectedTags: filters.frequencyCategories
      ?.map(cat => FREQUENCY_LABELS[cat]),
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const hasFilters = Boolean(searchQuery.trim()) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    Boolean(filters.frequencyCategories?.length);

  return (
    <SearchResultsSummary
      searchQuery={searchQuery}
      filterSummary={filterSummary}
      totalCount={totalCount}
      onClearAllFilters={onClearAllFilters}
      hasFilters={hasFilters}
      filters={baseFilters}
    />
  );
};
