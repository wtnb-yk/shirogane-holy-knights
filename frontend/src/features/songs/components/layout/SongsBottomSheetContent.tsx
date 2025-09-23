'use client';

import React from 'react';
import { SortBy, SortOrder, SongFilterOptions, SongContentType } from '@/features/songs/types/types';
import { SongSortSection } from '@/features/songs/components/search/SongSortSection';
import { SongFilterSection } from '@/features/songs/components/search/SongFilterSection';
import { YearPresetsSection } from '@/components/common/YearPresetsSection';
import { DatePresetsSection } from '@/components/common/DatePresetsSection';
import { SongFrequencySection } from '@/features/songs/components/search/internals/SongFrequencySection';
import { SearchInput } from '@/components/ui/SearchInput';

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
  searchValue,
  onSearch,
  onClearSearch,
  sortBy,
  sortOrder,
  filters,
  onSortChange,
  onFiltersChange
}: SongsBottomSheetContentProps) => {
  const handleSearchChange = (value: string) => {
    if (!value) {
      onClearSearch();
    }
  };

  return (
    <>
      {/* 楽曲検索セクション */}
      <SearchInput
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        placeholder="楽曲名・アーティスト名を入力"
        variant="sidebar"
        size="sm"
      />

      {/* 並び替えセクション */}
      <SongSortSection
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={(sortBy) => onSortChange(sortBy, sortOrder)}
        onSortOrderChange={(sortOrder) => onSortChange(sortBy, sortOrder)}
      />

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
    </>
  );
};
