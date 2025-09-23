'use client';

import React from 'react';
import { FilterOptions } from '@/features/archives/components/filter/ArchiveFilterSection';
import { TagBadges } from '@/components/common/Sidebar/TagBadges';
import { DateRangeSection } from '@/components/ui/DateRangeSection';
import { SearchInput } from '@/components/ui/SearchInput';

interface ArchiveBottomSheetContentProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  availableTags?: string[];
}

export const ArchiveBottomSheetContent = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters,
  availableTags = []
}: ArchiveBottomSheetContentProps) => {
  const handleSearchChange = (value: string) => {
    if (!value) {
      onClearSearch();
    }
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.selectedTags || [];
    if (currentTags.includes(tag)) {
      setFilters({
        ...filters,
        selectedTags: []
      });
    } else {
      setFilters({
        ...filters,
        selectedTags: [tag]
      });
    }
  };


  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters({ ...filters, [field]: value || undefined });
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-3">
        <div className="space-y-6">

          {/* アーカイブ検索セクション */}
          <div>
            <SearchInput
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              onSearch={onSearch}
              onClearSearch={onClearSearch}
              placeholder="キーワードを入力"
              variant="sidebar"
              size="sm"
            />
          </div>


          {/* 高度なタグフィルター */}
          {availableTags.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-2">タグ</h3>
              <TagBadges
                tags={availableTags}
                selectedTags={filters.selectedTags}
                onTagToggle={handleTagToggle}
              />
            </div>
          )}

          {/* 日付フィルター */}
          <div>
            <DateRangeSection
              title="配信日"
              startDate={filters.startDate}
              endDate={filters.endDate}
              onDateChange={handleDateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
