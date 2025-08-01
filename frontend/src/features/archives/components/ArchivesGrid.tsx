'use client';

import React from 'react';
import { ArchiveDto } from '../types/types';
import { ArchiveCard } from './ArchiveCard';
import { SkeletonCard } from './SkeletonCard';

interface ArchivesGridProps {
  archives: ArchiveDto[];
  loading: boolean;
  error?: string | null;
}

export const ArchivesGrid = ({ archives, loading, error }: ArchivesGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (archives.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl text-gray-600">アーカイブが見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {archives.map((archive, index) => (
        <ArchiveCard key={archive.id} archive={archive} index={index} />
      ))}
    </div>
  );
};