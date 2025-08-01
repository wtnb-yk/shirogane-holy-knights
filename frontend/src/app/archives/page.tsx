'use client';

import React, { useState } from 'react';
import { useArchives } from '@/features/archives/hooks/useArchives';
import { SearchBar } from '@/features/archives/components/SearchBar';
import { FilterBar } from '@/features/archives/components/FilterBar';
import { ArchivesGrid } from '@/features/archives/components/ArchivesGrid';
import { Pagination } from '@/features/archives/components/Pagination';

export default function ArchivesList() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  
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
    clearSearch,
    filters,
    setFilters,
    availableTags,
    clearAllFilters
  } = useArchives({ pageSize: 20 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100/30 to-sage-200/50">
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

        {(searchQuery || filters.selectedTags.length > 0 || filters.startDate || filters.endDate) && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-sage-200">
            <div className="flex items-center justify-between">
              <div className="text-sage-300">
                {searchQuery && (
                  <span>
                    「<span className="font-medium text-gray-800">{searchQuery}</span>」
                  </span>
                )}
                {(filters.selectedTags.length > 0 || filters.startDate || filters.endDate) && (
                  <span className={searchQuery ? 'ml-2' : ''}>
                    {searchQuery ? 'とフィルター' : 'フィルター'}による検索結果
                  </span>
                )}
                {totalCount > 0 && <span className="ml-2">({totalCount}件)</span>}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-sm text-sage-300 hover:text-gray-600 transition-colors"
              >
                すべてクリア
              </button>
            </div>
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

        {/* フィルターモーダル */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">フィルター設定</h2>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-sage-300 hover:text-gray-600 transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>
                <FilterBar
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableTags={availableTags}
                />
                <div className="flex gap-3 mt-6 pt-4 border-t border-sage-200">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-2 bg-sage-300 text-white rounded-md hover:bg-sage-300/80 transition-colors"
                  >
                    適用
                  </button>
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setShowFilterModal(false);
                    }}
                    className="px-4 py-2 border border-sage-200 text-sage-300 rounded-md hover:bg-sage-100 transition-colors"
                  >
                    リセット
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}