'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { SortBy, SortOrder, SongFilterOptions, SongContentType } from '@/features/songs/types/types';
import { ContentTypeTabs, Tab } from '@/components/common/ContentTypeTabs';
import { SongSortSection } from '@/features/songs/components/SongSortSection';
import { SongFilterSection } from '@/features/songs/components/SongFilterSection';
import { YearPresetsSection } from '@/components/common/YearPresetsSection';
import { DatePresetsSection } from '@/components/common/DatePresetsSection';
import { SongFrequencySection } from '@/features/songs/components/SongsSidebar/SongFrequencySection';

interface SongsBottomSheetContentProps {
  songContentType: SongContentType;
  onSongContentTypeChange: (type: SongContentType) => void;
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filters: SongFilterOptions;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onFiltersChange: (filters: SongFilterOptions) => void;
}

export const SongsBottomSheetContent = ({
  songContentType,
  onSongContentTypeChange,
  searchValue,
  onSearch,
  onClearSearch,
  sortBy,
  sortOrder,
  filters,
  onSortChange,
  onFiltersChange
}: SongsBottomSheetContentProps) => {
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

  const songContentTypeTabs: Tab[] = [
    { value: SongContentType.CONCERT, label: 'ライブ' },
    { value: SongContentType.STREAM, label: '歌枠' }
  ];

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-3">
        <div className="space-y-6">
          {/* コンテンツタイプタブ */}
          <div className="scale-90">
            <ContentTypeTabs
              tabs={songContentTypeTabs}
              activeTab={songContentType}
              onTabChange={onSongContentTypeChange}
            />
          </div>

          {/* 楽曲検索セクション */}
          <div>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-text-tertiary w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="楽曲名・アーティスト名を入力"
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

          {/* 並び替えセクション */}
          <div>
            <SongSortSection
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={(sortBy) => onSortChange(sortBy, sortOrder)}
              onSortOrderChange={(sortOrder) => onSortChange(sortBy, sortOrder)}
            />
          </div>

          {/* 歌唱日 */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-2">
              歌唱日
            </h3>
            
            {/* プリセットボタン */}
            <div className="mb-4">
              <div className="[&_h3]:hidden [&_button]:py-1.5 [&_button]:px-2.5 [&_button]:text-sm [&_li]:space-y-0.5">
                {songContentType === SongContentType.CONCERT ? (
                  <YearPresetsSection
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    title=""
                  />
                ) : (
                  <DatePresetsSection
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    title=""
                  />
                )}
              </div>
            </div>

            {/* 日付入力 */}
            <div>
              <div className="[&_h4]:hidden [&_input]:py-2 [&_input]:px-2.5 [&_input]:text-sm">
                <SongFilterSection
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                />
              </div>
            </div>
          </div>

          {/* 歌唱回数フィルター（歌枠のみ） */}
          {songContentType === SongContentType.STREAM && (
            <div>
              <div className="[&_h3]:text-sm [&_h3]:mb-2 [&_button]:py-1.5 [&_button]:px-2.5 [&_button]:text-sm [&_li]:space-y-0.5">
                <SongFrequencySection
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};