'use client';

import React from 'react';
import { DiscographyListGrid } from './DiscographyListGrid';
import { AlbumDto } from '../types/types';
import { DiscographyCard } from './DiscographyCard';
import { SkeletonDiscographyCard } from './SkeletonDiscographyCard';

interface DiscographyGridProps {
  albums: AlbumDto[];
  loading: boolean;
  error: string | null;
  onAlbumClick?: (album: AlbumDto) => void;
}

export const DiscographyGrid = ({ albums, loading, error, onAlbumClick }: DiscographyGridProps) => {
  return (
    <DiscographyListGrid
      items={albums}
      loading={loading}
      error={error}
      renderItem={(albumItem, index) => (
        <DiscographyCard
          key={albumItem.id}
          album={albumItem}
          index={index}
          onClick={() => onAlbumClick?.(albumItem)}
        />
      )}
      renderSkeleton={(index) => <SkeletonDiscographyCard index={index} />}
      emptyMessage={{
        title: 'アルバムが見つかりませんでした',
        subtitle: '検索条件を変更してお試しください'
      }}
      skeletonCount={6}
    />
  );
};