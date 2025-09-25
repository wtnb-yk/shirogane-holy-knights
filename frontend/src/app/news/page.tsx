'use client';

import React, { useState } from 'react';
import { useNews } from '@/features/news/hooks/useNews';
import { NewsGrid } from '@/features/news/components/NewsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { NewsSearchResultsSummary } from "@/features/news/components/NewsSearchResultsSummary";
import { NewsSidebarContent } from '@/features/news/components/NewsSidebarContent';
import { FilterToggleButton } from '@/components/common/Sidebar/FilterToggleButton';
import { NewsBottomSheetContent } from '@/features/news/components/NewsBottomSheetContent';
import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

export default function NewsPage() {
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);

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
      desktopSidebar={{
        content: (
          <NewsSidebarContent
            searchValue={searchQuery}
            onSearch={handleSearch}
            onClearSearch={clearSearch}
            filters={filters}
            setFilters={setFilters}
          />
        )
      }}
      mobileBottomSheet={{
        trigger: (
          <FilterToggleButton
            onClick={() => setMobileBottomSheetOpen(true)}
            hasActiveFilters={activeFiltersCount > 0}
            activeFiltersCount={activeFiltersCount}
            variant="search"
          />
        ),
        isOpen: mobileBottomSheetOpen,
        onClose: () => setMobileBottomSheetOpen(false),
        title: '検索・絞り込み',
        content: (
          <NewsBottomSheetContent
            searchValue={searchQuery}
            onSearch={handleSearch}
            onClearSearch={clearSearch}
            filters={filters}
            setFilters={setFilters}
          />
        )
      }}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasMore={hasMore}
        onPageChange={setCurrentPage}
        totalCount={totalCount}
        pageSize={10}
        loading={loading}
      />
    </PageLayout>
  );
}