'use client';

import React from 'react';
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
    setCurrentPage,
    searchQuery,
    handleSearch,
    clearSearch
  } = useArchives({ pageSize: 20 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100/30 to-sage-200/50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 opacity-0 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            配信アーカイブ
          </h1>
          <p className="text-sage-300">過去の配信を振り返ろう</p>
        </div>

        <SearchBar 
          searchValue={searchQuery}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
        />

        {searchQuery && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-sage-200">
            <p className="text-sage-300">
              「<span className="font-medium text-gray-800">{searchQuery}</span>」の検索結果
              {totalCount > 0 && <span className="ml-2">({totalCount}件)</span>}
            </p>
          </div>
        )}

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
          <div className="text-center text-sm text-sage-300 mt-6 opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
            {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalCount)} / {totalCount} 件
          </div>
        )}
      </div>
    </div>
  );
}