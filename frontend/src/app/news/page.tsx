'use client';

import React, { useState } from 'react';
import { useNews } from '@/features/news/hooks/useNews';
import { NewsGrid } from '@/features/news/components/NewsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { NewsStatsSummary } from '@/features/news/components/NewsStatsSummary';
import { NewsSearchResultsSummary } from "@/features/news/components/NewsSearchResultsSummary";
import { NewsSidebar } from '@/features/news/components/NewsSidebar';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { MobileDropdownNewsSection } from '@/components/common/Sidebar/MobileDropdownNewsSection';

export default function NewsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  // アクティブなフィルター数を計算
  const activeFiltersCount = (searchQuery ? 1 : 0) + 
    (filters.categoryIds?.length || 0);

  return (
    <div className="min-h-screen bg-white">
      {/* メインコンテナ */}
      <div className="flex flex-col md:flex-row max-w-full py-8 px-10 gap-10">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          <div className="page-header mb-6">
            <h1 className="text-5xl font-black text-text-primary mb-3 tracking-wider">
              NEWS
            </h1>
            
            {/* スマホサイズではボタンをタイトル下に表示 */}
            <div className="sm:hidden mb-4">
              <MobileSidebarButton 
                onClick={() => setIsSidebarOpen(true)}
                hasActiveFilters={activeFiltersCount > 0}
                activeFiltersCount={activeFiltersCount}
                variant="search"
              />
            </div>
            
            {/* タブレット以上では説明文とボタンを横並び */}
            <div className="hidden sm:flex items-start justify-between mb-4">
              <p className="text-sm text-text-secondary leading-relaxed flex-1">
                白銀ノエルさん関連のニュースや話題をまとめています。<br />
                カテゴリやキーワードで検索して最新情報をチェックできます。
              </p>
              
              {/* タブレット用メニューボタン（lg未満のみ表示） */}
              <div className="lg:hidden ml-4 relative">
                <MobileSidebarButton 
                  onClick={() => setIsSidebarOpen(true)}
                  hasActiveFilters={activeFiltersCount > 0}
                  activeFiltersCount={activeFiltersCount}
                  variant="search"
                />
                
                {/* レスポンシブサイドバー */}
                <ResponsiveSidebar 
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  mobileContent={
                    <MobileDropdownNewsSection
                      searchValue={searchQuery}
                      onSearch={handleSearch}
                      onClearSearch={clearSearch}
                      filters={filters}
                      setFilters={setFilters}
                    />
                  }
                >
                  <NewsSidebar
                    searchValue={searchQuery}
                    onSearch={handleSearch}
                    onClearSearch={clearSearch}
                    filters={filters}
                    setFilters={setFilters}
                  />
                </ResponsiveSidebar>
              </div>
            </div>
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

        {/* デスクトップサイドバー */}
        <ResponsiveSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        >
          <NewsSidebar
            searchValue={searchQuery}
            onSearch={handleSearch}
            onClearSearch={clearSearch}
            filters={filters}
            setFilters={setFilters}
          />
        </ResponsiveSidebar>
      </div>
    </div>
  );
}