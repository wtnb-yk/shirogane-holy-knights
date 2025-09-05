'use client';

import React from 'react';
import { ContentType } from '@/features/archives/types/types';
import { FilterOptions } from '@/features/archives/components/filter/VideoFilterSection';
import { SearchInput } from './components/SearchInput';
import { ContentTypeTabs } from './components/ContentTypeTabs';
import { CategoryButtons } from './components/CategoryButtons';
import { TagBadges } from './components/TagBadges';
import { DateRangeInput } from './components/DateRangeInput';

interface MobileDropdownVideosSectionProps {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  availableTags?: string[];
  displayCategories?: string[];
}

export const MobileDropdownVideosSection = ({
  contentType,
  onContentTypeChange,
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters,
  availableTags = [],
  displayCategories = ['雑談', 'ゲーム','ASMR', '歌枠', 'コラボ']
}: MobileDropdownVideosSectionProps) => {
  const [inputValue, setInputValue] = React.useState(searchValue);

  React.useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
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

  const handleTagClear = () => {
    setFilters({
      ...filters,
      selectedTags: []
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters({ ...filters, [field]: value || undefined });
  };

  const contentTypeOptions = [
    { key: ContentType.STREAMS, label: '配信' },
    { key: ContentType.VIDEOS, label: '動画' }
  ];

  return (
    <div className="space-y-6">
      {/* コンテンツタイプタブ */}
      <ContentTypeTabs
        options={contentTypeOptions}
        selectedType={contentType}
        onTypeChange={(type) => onContentTypeChange(type as ContentType)}
      />

      {/* 検索セクション */}
      <SearchInput
        value={inputValue}
        onChange={handleInputChange}
        onSubmit={onSearch}
        onClear={onClearSearch}
        placeholder="キーワードを入力"
      />

      {/* カテゴリフィルター - 配信タブでのみ表示 */}
      {contentType === ContentType.STREAMS && (
        <div className="border-t border-surface-border pt-6">
          <h4 className="text-sm font-semibold text-text-primary mb-4">カテゴリ</h4>
          <CategoryButtons
            categories={displayCategories}
            selectedCategories={filters.selectedTags || []}
            onCategoryToggle={handleTagToggle}
            onClearAll={handleTagClear}
          />
        </div>
      )}

      {/* 高度なタグフィルター */}
      {availableTags.length > 0 && (
        <div className="border-t border-surface-border pt-6">
          <h4 className="text-sm font-semibold text-text-primary mb-4">タグ</h4>
          <TagBadges
            tags={availableTags}
            selectedTags={filters.selectedTags}
            onTagToggle={handleTagToggle}
          />
        </div>
      )}

      {/* 日付フィルター */}
      <div className="border-t border-surface-border pt-6">
        <h4 className="text-sm font-semibold text-text-primary mb-4">配信日</h4>
        <DateRangeInput
          startDate={filters.startDate}
          endDate={filters.endDate}
          onDateChange={handleDateChange}
        />
      </div>
    </div>
  );
};
