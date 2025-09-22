'use client';

import React, { useState } from 'react';
import { useNews } from '@/features/news/hooks/useNews';
import { NewsGrid } from '@/features/news/components/NewsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { NewsStatsSummary } from '@/features/news/components/NewsStatsSummary';
import { NewsSearchResultsSummary } from "@/features/news/components/NewsSearchResultsSummary";
import { NewsSidebar } from '@/features/news/components/NewsSidebar';
import { FilterToggleButton } from '@/components/common/Sidebar/FilterToggleButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { NewsBottomSheetContent } from '@/features/news/components/NewsBottomSheetContent';
import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

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

  const activeFiltersCount = (searchQuery ? 1 : 0) + 
    (filters.categoryIds?.length || 0);

  return (
    <PageLayout
      title="NEWS"
      description={
        <p>
          白銀ノエルさん関連のニュースや話題をまとめています。<br />
          カテゴリやキーワードで検索して最新情報をチェックできます。
        </p>
      }
      mobileActions={
        <FilterToggleButton
          onClick={() => setIsSidebarOpen(true)}
          hasActiveFilters={activeFiltersCount > 0}
          activeFiltersCount={activeFiltersCount}
          variant="search"
        />
      }
      sidebar={
        <ResponsiveSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          mobileContent={
            <NewsBottomSheetContent
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
      }
    >
      <BreadcrumbSchema items={[
        { name: 'ホーム', url: 'https://www.noe-room.com/' },
        { name: 'ニュース', url: 'https://www.noe-room.com/news' }
      ]} />
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
    </PageLayout>
  );
}
