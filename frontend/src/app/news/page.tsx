'use client';

import React from 'react';
import { useNews } from '@/features/news/hooks/useNews';
import { NewsGrid } from '@/features/news/components/NewsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { NewsStatsSummary } from '@/features/news/components/NewsStatsSummary';
import { NewsSearchResultsSummary } from "@/features/news/components/NewsSearchResultsSummary";
import { NewsSidebar } from '@/features/news/components/NewsSidebar';

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
    <div className="min-h-screen bg-white">
      {/* メインコンテナ */}
      <div className="flex max-w-full py-8 px-10 gap-10">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          <div className="page-header mb-8">
            <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-wider">
              NEWS
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              白銀ノエルさん関連のニュースや話題をまとめています。<br />
              カテゴリやキーワードで検索して最新情報をチェックできます。
            </p>
          </div>

          <NewsSearchResultsSummary
            searchQuery={searchQuery}
            filters={filters}
            totalCount={totalCount}
            onClearAllFilters={clearAllFilters}
          />

          <NewsGrid 
            news={news} 
            loading={loading} 
            error={error} 
          />

          {totalCount > 10 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasMore={hasMore}
              onPageChange={setCurrentPage}
              size="sm"
            />
          )}

          <NewsStatsSummary
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={10}
            loading={loading}
          />
        </main>

        {/* サイドバー（右側） */}
        <NewsSidebar
          searchValue={searchQuery}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </div>
  );
}
