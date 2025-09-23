'use client';

import React from 'react';
import { FilterOptions } from '../search/ArchiveFilterSection';
import { MultiSelectSection } from '@/components/common/MultiSelectSection';
import { DateRangeSection } from '@/components/ui/DateRangeSection';
import { SearchInput } from '@/components/ui/SearchInput';

interface ArchiveBottomSheetContentProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  availableTags?: string[];
  loading?: boolean;
}

export const ArchiveBottomSheetContent = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters,
  availableTags = [],
  loading = false
}: ArchiveBottomSheetContentProps) => {
  const handleSearchChange = (value: string) => {
    if (!value) {
      onClearSearch();
    }
  };

  const handleTagChange = (tags: string[]) => {
    setFilters({
      ...filters,
      selectedTags: tags
    });
  };


  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters({ ...filters, [field]: value || undefined });
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-3">
        <div className="space-y-6">

          {/* アーカイブ検索セクション */}
          <SearchInput
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            placeholder="キーワードを入力"
            variant="sidebar"
            size="sm"
          />


          {/* 高度なタグフィルター */}
          <MultiSelectSection
            options={availableTags}
            value={filters.selectedTags || []}
            onChange={handleTagChange}
            title="タグ"
            placeholder="タグを選択"
            loading={loading}
          />

          {/* 日付フィルター */}
          <DateRangeSection
            title="配信日"
            startDate={filters.startDate}
            endDate={filters.endDate}
            onDateChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
};
