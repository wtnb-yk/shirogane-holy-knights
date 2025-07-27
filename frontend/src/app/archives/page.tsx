'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useArchives } from '@/hooks/useArchives';
import { SearchBar } from '@/components/archives/SearchBar';
import { ArchivesGrid } from '@/components/archives/ArchivesGrid';
import { Pagination } from '@/components/archives/Pagination';

export default function ArchivesList() {
  const {
    archives,
    loading,
    error,
    currentPage,
    totalCount,
    hasMore,
    totalPages,
    setCurrentPage
  } = useArchives({ pageSize: 20 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100/30 to-sage-200/50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            配信アーカイブ
          </h1>
          <p className="text-sage-300">過去の配信を振り返ろう</p>
        </motion.div>

        <SearchBar disabled />

        <ArchivesGrid archives={archives} loading={loading} error={error} />

        {totalCount > 20 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            onPageChange={setCurrentPage}
          />
        )}

        {totalCount > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-sage-300 mt-6"
          >
            {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalCount)} / {totalCount} 件
          </motion.div>
        )}
      </div>
    </div>
  );
}