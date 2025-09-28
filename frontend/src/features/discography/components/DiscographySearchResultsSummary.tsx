'use client';

import React from 'react';
import { SearchResultsSummary } from '@/components/Stats/SearchResultsSummary';
import { AlbumFilterOptions } from '../types/types';
import { useAlbumTypes } from '../hooks/useAlbumTypes';
import { getAlbumTypeDisplayName } from '@/utils/albumTypeUtils';

interface DiscographySearchResultsSummaryProps {
  searchQuery: string;
  filters: AlbumFilterOptions;
  totalCount: number;
  onClearAllFilters: () => void;
}

export const DiscographySearchResultsSummary = ({
  searchQuery,
  filters,
  totalCount,
  onClearAllFilters
}: DiscographySearchResultsSummaryProps) => {
  const { albumTypes } = useAlbumTypes();

  const hasFilters = Boolean(searchQuery.trim()) || Boolean(filters.albumTypes && filters.albumTypes.length > 0);

  const getAlbumTypeName = (albumTypeId?: string) => {
    if (!albumTypeId) return null;
    const albumType = albumTypes.find(at => at.id.toString() === albumTypeId);
    return albumType ? getAlbumTypeDisplayName(albumType.typeName) : '';
  };

  const albumTypeNames = filters.albumTypes?.map(getAlbumTypeName).filter(Boolean).join(', ');
  const filterSummary = albumTypeNames ? `カテゴリ: ${albumTypeNames}` : undefined;

  return (
    <SearchResultsSummary
      searchQuery={searchQuery}
      filterSummary={filterSummary}
      totalCount={totalCount}
      onClearAllFilters={onClearAllFilters}
      hasFilters={hasFilters}
    />
  );
};
