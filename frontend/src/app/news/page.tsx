'use client';

import React from 'react';
import { useNews } from '@/features/news/hooks/useNews';
import { SearchInput } from '@/components/ui/SearchInput';
import { NewsCategoryFilter } from '@/features/news/components/NewsCategoryFilter';
import { NewsGrid } from '@/features/news/components/NewsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { NewsStatsSummary } from '@/features/news/components/NewsStatsSummary';
import { NewsSearchResultsSummary } from "@/features/news/components/NewsSearchResultsSummary";

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
  } = useNews({ pageSize: 10 });

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ページタイトル */}
        <div className="mb-8 opacity-0 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2 text-text-primary">
            ニュース
          </h1>
        </div>

        {/* 検索バー */}
        <div className="mb-8 flex flex-wrap gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <SearchInput 
            searchValue={searchQuery}
            onSearch={handleSearch}
            onClearSearch={clearSearch}
            placeholder="気になるニュースを探してみてください"
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
        {totalCount > 10 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            onPageChange={setCurrentPage}
            loading={loading}
            animationDelay="600ms"
            size="md"
          />
        )}

        {/* 統計サマリー */}
        <NewsStatsSummary
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={10}
          loading={loading}
        />
      </div>
    </div>
  );
}
