'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { AlbumFilterOptions } from '@/features/discography/types/types';
import { useAlbumTypes } from '@/features/discography/hooks/useAlbumTypes';
import { TagBadges } from '@/components/common/Sidebar/TagBadges';
import { getAlbumTypeDisplayName } from '@/utils/albumTypeUtils';

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
  const [inputValue, setInputValue] = React.useState(searchValue);
  const { albumTypes, loading } = useAlbumTypes();
  const selectedAlbumTypes = filters.albumTypes || [];

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
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-text-tertiary w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="アルバム・アーティストを探す"
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
