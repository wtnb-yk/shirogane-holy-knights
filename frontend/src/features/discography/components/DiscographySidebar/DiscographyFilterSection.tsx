'use client';

import React from 'react';
import { AlbumFilterOptions } from '../../types/types';
import { useAlbumTypes } from '../../hooks/useAlbumTypes';

interface DiscographyFilterSectionProps {
  filters: AlbumFilterOptions;
  onFiltersChange: (filters: AlbumFilterOptions) => void;
}

export const DiscographyFilterSection = ({
  filters,
  onFiltersChange
}: DiscographyFilterSectionProps) => {
  const { albumTypes, loading } = useAlbumTypes();
  const selectedAlbumTypes = filters.albumTypes || [];

  const handleAlbumTypeToggle = (albumTypeId: string) => {
    if (selectedAlbumTypes.includes(albumTypeId)) {
      // 同じタイプをクリックした場合は選択解除（全て状態に戻る）
      onFiltersChange({
        ...filters,
        albumTypes: undefined,
      });
    } else {
      // 異なるタイプをクリックした場合は、そのタイプのみを選択
      onFiltersChange({
        ...filters,
        albumTypes: [albumTypeId],
      });
    }
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      albumTypes: undefined,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-bold text-text-primary">アルバムタイプ</h3>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-8 bg-bg-tertiary rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-text-primary">アルバムタイプ</h3>

      <div className="space-y-2">
        {/* 全てクリアボタン */}
        <button
          onClick={handleClearAll}
          className={`w-full py-2 px-3 rounded-md text-sm transition-all text-left ${
            selectedAlbumTypes.length === 0
              ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
              : 'text-text-secondary hover:bg-accent-gold-light hover:pl-4'
          }`}
        >
          全て
        </button>

        {/* アルバムタイプボタン */}
        {albumTypes.map((albumType) => {
          const isSelected = selectedAlbumTypes.includes(albumType.id.toString());
          return (
            <button
              key={albumType.id}
              onClick={() => handleAlbumTypeToggle(albumType.id.toString())}
              className={`w-full py-2 px-3 rounded-md text-sm transition-all text-left ${
                isSelected
                  ? 'bg-accent-gold-light text-accent-gold-dark font-semibold'
                  : 'text-text-secondary hover:bg-accent-gold-light hover:pl-4'
              }`}
            >
              {albumType.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};