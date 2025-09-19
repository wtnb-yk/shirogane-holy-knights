'use client';

import React, { useState } from 'react';
import { useDiscography } from '@/features/discography/hooks/useDiscography';
import { DiscographyGrid } from '@/features/discography/components/DiscographyGrid';
import { Pagination } from '@/components/ui/Pagination';
import { DiscographySearchResultsSummary } from "@/features/discography/components/DiscographySearchResultsSummary";
import { DiscographySidebar } from '@/features/discography/components/DiscographySidebar';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { DiscographyBottomSheetContent } from '@/features/discography/components/DiscographyBottomSheetContent';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { BottomSheetHeader } from '@/components/common/BottomSheet/BottomSheetHeader';
import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { DiscographyDetailModal } from '@/features/discography/components/DiscographyDetailModal';
import { AlbumDto } from '@/features/discography/types/types';

export default function DiscographyPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
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
  } = useDiscography({ pageSize: 10 });

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
          白銀聖騎士団の音楽リリースをまとめています。<br />
          アルバムタイプやキーワードで検索して楽曲をチェックできます。
        </p>
      }
      headerActions={
        <div className="lg:hidden ml-4 relative">
          <MobileSidebarButton
            onClick={() => setIsBottomSheetOpen(true)}
            hasActiveFilters={activeFiltersCount > 0}
            activeFiltersCount={activeFiltersCount}
            variant="search"
          />
        </div>
      }
      mobileActions={
        <MobileSidebarButton
          onClick={() => setIsBottomSheetOpen(true)}
          hasActiveFilters={activeFiltersCount > 0}
          activeFiltersCount={activeFiltersCount}
          variant="search"
        />
      }
      sidebar={
        <ResponsiveSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
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

      {totalCount > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
          onPageChange={setCurrentPage}
          size="sm"
        />
      )}

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <BottomSheetHeader
          title="検索・絞り込み"
          onClose={() => setIsBottomSheetOpen(false)}
        />
        <DiscographyBottomSheetContent
          searchValue={searchQuery}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          filters={filters}
          setFilters={setFilters}
        />
      </BottomSheet>

      <DiscographyDetailModal
        album={selectedAlbum}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
      />
    </PageLayout>
  );
}