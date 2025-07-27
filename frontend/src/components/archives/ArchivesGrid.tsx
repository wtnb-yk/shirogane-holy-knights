'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArchiveDto } from '@/api/types';
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">😢</div>
        <p className="text-xl text-red-500">{error}</p>
      </motion.div>
    );
  }

  if (archives.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl text-gray-600">アーカイブが見つかりませんでした。</p>
      </motion.div>
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