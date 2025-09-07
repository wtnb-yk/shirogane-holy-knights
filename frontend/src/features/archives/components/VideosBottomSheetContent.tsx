'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { FilterOptions } from '@/features/archives/components/filter/VideoFilterSection';
import { TagBadges } from '@/components/common/Sidebar/components/TagBadges';
import { MobileDateRangeInput } from '@/components/common/Sidebar/components/MobileDateRangeInput';

interface VideosBottomSheetContentProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  availableTags?: string[];
}

export const VideosBottomSheetContent = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters,
  availableTags = []
}: VideosBottomSheetContentProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onClearSearch();
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
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-text-tertiary w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="キーワードを入力"
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
            <h3 className="text-sm font-bold text-text-primary mb-2">配信日</h3>
            <MobileDateRangeInput
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