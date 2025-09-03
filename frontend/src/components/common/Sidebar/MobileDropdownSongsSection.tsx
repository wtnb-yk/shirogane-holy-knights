'use client';

import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { SortBy, SortOrder, SongFilterOptions } from '@/features/songs/types/types';
import { SearchInput } from './components/SearchInput';
import { SortSection } from './components/SortSection';
import { DateRangeInput } from './components/DateRangeInput';

interface MobileDropdownSongsSectionProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filters: SongFilterOptions;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onFiltersChange: (filters: SongFilterOptions) => void;
}

export const MobileDropdownSongsSection = ({
  searchValue,
  onSearch,
  onClearSearch,
  sortBy,
  sortOrder,
  filters,
  onSortChange,
  onFiltersChange
}: MobileDropdownSongsSectionProps) => {
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

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined });
  };

  const sortOptions = [
    { value: SortBy.SING_COUNT, label: '歌唱回数', icon: TrendingUp, description: '人気の高い楽曲順' },
    { value: SortBy.LATEST_SING_DATE, label: '最新歌唱日', icon: Calendar, description: '最近歌った楽曲順' }
  ];

  const orderOptions = [
    { value: SortOrder.DESC, label: sortBy === SortBy.SING_COUNT ? '多い → 少ない' : '新しい → 古い' },
    { value: SortOrder.ASC, label: sortBy === SortBy.SING_COUNT ? '少ない → 多い' : '古い → 新しい' }
  ];

  return (
    <div className="space-y-6">
      {/* 検索セクション */}
      <SearchInput
        value={inputValue}
        onChange={handleInputChange}
        onSubmit={onSearch}
        onClear={onClearSearch}
        placeholder="楽曲名・アーティスト名を入力"
      />

      {/* 並び替えセクション */}
      <div className="border-t border-surface-border pt-6">
        <h4 className="text-sm font-semibold text-text-primary mb-4">並び替え</h4>
        <SortSection
          sortOptions={sortOptions}
          orderOptions={orderOptions}
          selectedSort={sortBy}
          selectedOrder={sortOrder}
          onSortChange={(sortBy, sortOrder) => onSortChange(sortBy as SortBy, sortOrder as SortOrder)}
        />
      </div>

      {/* 日付フィルターセクション */}
      <div className="border-t border-surface-border pt-6">
        <h4 className="text-sm font-semibold text-text-primary mb-4">歌唱日</h4>
        <DateRangeInput
          startDate={filters.startDate}
          endDate={filters.endDate}
          onDateChange={handleDateChange}
        />
      </div>
    </div>
  );
};
