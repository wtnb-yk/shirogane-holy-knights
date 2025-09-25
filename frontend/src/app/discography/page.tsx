'use client';

import React, { useState } from 'react';
import { useDiscography } from '@/features/discography/hooks/useDiscography';
import { DiscographyGrid } from '@/features/discography/components/DiscographyGrid';
import { Pagination } from '@/components/ui/Pagination';
import { DiscographySearchResultsSummary } from "@/features/discography/components/DiscographySearchResultsSummary";
import { DiscographySidebarContent } from '@/features/discography/components/DiscographySidebarContent';
import { FilterToggleButton } from '@/components/common/Sidebar/FilterToggleButton';
import { DiscographyBottomSheetContent } from '@/features/discography/components/DiscographyBottomSheetContent';
import { PageLayout } from '@/components/common/PageLayout';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { DiscographyDetailModal } from '@/features/discography/components/DiscographyDetailModal';
import { AlbumDto } from '@/features/discography/types/types';

const PAGE_SIZE = 12;

export default function DiscographyPage() {
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);
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
      desktopSidebar={{
        content: (
          <DiscographySidebarContent
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
          <DiscographyBottomSheetContent
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasMore={hasMore}
        onPageChange={setCurrentPage}
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