'use client';

import React from 'react';
import { useNews } from '@/features/news/hooks/useNews';
import { SearchInput } from '@/components/ui/SearchInput';
import { NewsCategoryFilter } from '@/features/news/components/NewsCategoryFilter';
import { NewsSearchResultsSummary } from '@/features/news/components/NewsSearchResultsSummary';
import { NewsGrid } from '@/features/news/components/NewsGrid';
import { NewsPagination } from '@/features/news/components/NewsPagination';
import { NewsStatsSummary } from '@/features/news/components/NewsStatsSummary';

export default function NewsPage() {
  const {
    news,
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
    clearAllFilters
  } = useNews({ pageSize: 20 });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ページタイトル */}
        <div className="mb-8 opacity-0 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            ニュース
          </h1>
        </div>

        {/* 検索バー */}
        <div className="mb-8 flex flex-wrap gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <SearchInput 
            searchValue={searchQuery}
            onSearch={handleSearch}
            onClearSearch={clearSearch}
            placeholder="ニュースを検索..."
          />
        </div>

        {/* カテゴリフィルター */}
        <NewsCategoryFilter
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* 検索結果サマリー */}
        <NewsSearchResultsSummary
          searchQuery={searchQuery}
          filters={filters}
          totalCount={totalCount}
          onClearAllFilters={clearAllFilters}
        />

        {/* ニュースグリッド */}
        <NewsGrid 
          news={news} 
          loading={loading} 
          error={error} 
        />

        {/* ページネーション */}
        {totalCount > 20 && (
          <NewsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        )}

        {/* 統計サマリー */}
        <NewsStatsSummary
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={20}
          loading={loading}
        />
      </div>
    </div>
  );
}