'use client';

import React, { useState } from 'react';
import { useVideos } from '@/features/videos/hooks/useVideos';
import { SearchBar } from '@/features/videos/components/SearchBar';
import { FilterModal } from '@/features/videos/components/filter/FilterModal';
import { SearchResultsSummary } from '@/features/videos/components/results/SearchResultsSummary';
import { StatsSummary } from '@/features/videos/components/results/StatsSummary';
import { VideosGrid } from '@/features/videos/components/VideosGrid';
import { Pagination } from '@/components/ui/Pagination';

export default function VideosList() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const {
    videos,
    loading,
    error,
    currentPage,
    totalCount,
    hasMore,
    totalPages,
    setCurrentPage,
    searchQuery,
    handleSearch,
    clearSearch,
    filters,
    setFilters,
    availableTags,
    clearAllFilters
  } = useVideos({ pageSize: 20 });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 opacity-0 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            配信・動画
          </h1>
        </div>

        <SearchBar 
          searchValue={searchQuery}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          onFilterClick={() => setShowFilterModal(true)}
        />

        <SearchResultsSummary
          searchQuery={searchQuery}
          filters={filters}
          totalCount={totalCount}
          onClearAllFilters={clearAllFilters}
        />

        <VideosGrid videos={videos} loading={loading} error={error} />

        {totalCount > 20 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            onPageChange={setCurrentPage}
            size="sm"
          />
        )}

        <StatsSummary
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={20}
          loading={loading}
        />

        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={availableTags}
          onClearAllFilters={clearAllFilters}
        />
      </div>
    </div>
  );
}