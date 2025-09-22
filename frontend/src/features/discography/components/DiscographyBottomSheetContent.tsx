'use client';

import React from 'react';
import { AlbumFilterOptions } from '@/features/discography/types/types';
import { useAlbumTypes } from '@/features/discography/hooks/useAlbumTypes';
import { TagBadges } from '@/components/common/Sidebar/TagBadges';
import { getAlbumTypeDisplayName } from '@/utils/albumTypeUtils';
import { SearchInput } from '@/components/ui/SearchInput';

interface DiscographyBottomSheetContentProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: AlbumFilterOptions;
  setFilters: (filters: AlbumFilterOptions) => void;
}

export const DiscographyBottomSheetContent = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters
}: DiscographyBottomSheetContentProps) => {
  const { albumTypes, loading } = useAlbumTypes();
  const selectedAlbumTypes = filters.albumTypes || [];

  const handleSearchChange = (value: string) => {
    if (!value) {
      onClearSearch();
    }
  };

  const handleTagToggle = (tag: string) => {
    const albumType = albumTypes.find(at => at.typeName === tag);
    if (!albumType) return;

    const albumTypeId = albumType.id.toString();
    if (selectedAlbumTypes.includes(albumTypeId)) {
      setFilters({
        ...filters,
        albumTypes: undefined,
      });
    } else {
      setFilters({
        ...filters,
        albumTypes: [albumTypeId],
      });
    }
  };

  const tags = albumTypes.map(at => getAlbumTypeDisplayName(at.typeName));
  const selectedTags = albumTypes
    .filter(at => selectedAlbumTypes.includes(at.id.toString()))
    .map(at => getAlbumTypeDisplayName(at.typeName));

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-3">
        <div className="space-y-6">
          {/* アルバム検索セクション */}
          <div>
            <SearchInput
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              onSearch={onSearch}
              onClearSearch={onClearSearch}
              placeholder="アルバム・アーティストを探す"
              variant="sidebar"
              size="sm"
            />
          </div>

          {/* カテゴリ */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-2">カテゴリ</h3>
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-16 bg-bg-tertiary rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <TagBadges
                tags={tags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
