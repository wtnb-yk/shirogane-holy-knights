'use client';

import React from 'react';
import { AlbumFilterOptions } from '@/features/discography/types/types';
import { useAlbumTypes } from '@/features/discography/hooks/useAlbumTypes';
import { MultiSelectSection } from '@/components/common/MultiSelectSection';
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

  const handleTagChange = (tags: string[]) => {
    if (tags.length === 0) {
      setFilters({
        ...filters,
        albumTypes: undefined,
      });
    } else {
      const albumTypeIds = tags.map(tag => {
        const albumType = albumTypes.find(at => getAlbumTypeDisplayName(at.typeName) === tag);
        return albumType ? albumType.id.toString() : null;
      }).filter(Boolean) as string[];

      setFilters({
        ...filters,
        albumTypes: albumTypeIds,
      });
    }
  };

  const tags = albumTypes.map(at => getAlbumTypeDisplayName(at.typeName));
  const selectedTags = albumTypes
    .filter(at => selectedAlbumTypes.includes(at.id.toString()))
    .map(at => getAlbumTypeDisplayName(at.typeName));

  return (
    <>
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
      <MultiSelectSection
        options={tags}
        value={selectedTags}
        onChange={handleTagChange}
        title="カテゴリ"
        placeholder="カテゴリを選択"
        loading={loading}
      />
    </>
  );
};
