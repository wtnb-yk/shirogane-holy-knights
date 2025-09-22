'use client';

import React, { useState } from 'react';
import { useDiscography } from '@/features/discography/hooks/useDiscography';
import { DiscographyGrid } from '@/features/discography/components/DiscographyGrid';
import { Pagination } from '@/components/ui/Pagination';
import { DiscographySearchResultsSummary } from "@/features/discography/components/DiscographySearchResultsSummary";
import { DiscographySidebar } from '@/features/discography/components/DiscographySidebar';
import { FilterToggleButton } from '@/components/common/Sidebar/FilterToggleButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { DiscographyBottomSheetContent } from '@/features/discography/components/DiscographyBottomSheetContent';
import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { DiscographyDetailModal } from '@/features/discography/components/DiscographyDetailModal';
import { DiscographyStatsSummary } from '@/features/discography/components/DiscographyStatsSummary';
import { AlbumDto } from '@/features/discography/types/types';

const PAGE_SIZE = 12;

export default function DiscographyPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumDto | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    albums,
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
  } = useDiscography({ pageSize: PAGE_SIZE });

  const activeFiltersCount = (searchQuery ? 1 : 0) +
    (filters.albumTypes?.length || 0);

  const handleAlbumClick = (album: AlbumDto) => {
    setSelectedAlbum(album);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedAlbum(null);
  };

  return (
    <PageLayout
      title="DISCOGRAPHY"
      description={
        <p>
          白銀ノエルさんの配信楽曲や歌ってみたを検索・閲覧できます。<br />
          楽曲名での検索や配信日での並び替え、カテゴリでの絞り込みができます。
        </p>
      }
      desktopActions={
        <div className="lg:hidden ml-4 relative">
          <FilterToggleButton
            onClick={() => setIsSidebarOpen(true)}
            hasActiveFilters={activeFiltersCount > 0}
            activeFiltersCount={activeFiltersCount}
            variant="search"
          />
        </div>
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
            <DiscographyBottomSheetContent
              searchValue={searchQuery}
              onSearch={handleSearch}
              onClearSearch={clearSearch}
              filters={filters}
              setFilters={setFilters}
            />
          }
        >
          <DiscographySidebar
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
        { name: 'ディスコグラフィー', url: 'https://www.noe-room.com/discography' }
      ]} />
      <DiscographySearchResultsSummary
        searchQuery={searchQuery}
        filters={filters}
        totalCount={totalCount}
        onClearAllFilters={clearAllFilters}
      />

      <DiscographyGrid
        albums={albums}
        loading={loading}
        error={error}
        onAlbumClick={handleAlbumClick}
      />

      {totalCount > PAGE_SIZE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
          onPageChange={setCurrentPage}
          size="sm"
        />
      )}

      <DiscographyStatsSummary
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        loading={loading}
      />

      <DiscographyDetailModal
        album={selectedAlbum}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
      />
    </PageLayout>
  );
}
