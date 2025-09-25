'use client';

import React, { useState } from 'react';
import { useVideos } from '@/features/archives/hooks/useVideos';
import { useStreams } from '@/features/archives/hooks/useStreams';
import { ContentType } from '@/features/archives/types/types';
import { ArchiveSidebarContent } from '@/features/archives/components/layout/ArchiveSidebarContent';
import { ArchiveSearchOptionsModal } from '@/features/archives/components/search/ArchiveSearchOptionsModal';
import { ArchiveSearchResultsSummary } from '@/features/archives/components/display/results/ArchiveSearchResultsSummary';
import { VideosGrid } from '@/features/archives/components/display/grids/VideosGrid';
import { StreamsGrid } from '@/features/archives/components/display/grids/StreamsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { FilterToggleButton } from '@/components/common/Sidebar/FilterToggleButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { ArchiveBottomSheetContent } from '@/features/archives/components/layout/ArchiveBottomSheetContent';
import { PageLayout } from '@/components/common/PageLayout';
import { SegmentedControl } from '@/components/common/Sidebar/SegmentedControl';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

export default function ArchivePage() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contentType, setContentType] = useState<ContentType>(ContentType.STREAMS);

  const videosData = useVideos({pageSize: 20});
  const streamsData = useStreams({pageSize: 20});

  // 現在選択されているタブのデータを取得
  const currentData = contentType === ContentType.VIDEOS ? videosData : streamsData;

  // アクティブなフィルター数を計算
  const activeFiltersCount = (currentData.filters.selectedTags?.length || 0) +
    (currentData.searchQuery ? 1 : 0);

  return (
    <PageLayout
      title="ARCHIVE"
      description={
        <p>
          配信アーカイブの検索、カテゴリーや日付での絞り込みができます。<br/>
          最新の配信はYouTubeチャンネルをご確認ください。
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
      primaryTabs={
        <SegmentedControl
          tabs={[
            {value: ContentType.STREAMS, label: '配信'},
            {value: ContentType.VIDEOS, label: '動画'}
          ]}
          activeTab={contentType}
          onTabChange={(value) => setContentType(value as ContentType)}
        />
      }
      sidebar={
        <ResponsiveSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          desktopContent={
            <ArchiveSidebarContent
              contentType={contentType}
              onContentTypeChange={setContentType}
              searchValue={currentData.searchQuery}
              onSearch={currentData.handleSearch}
              onClearSearch={currentData.clearSearch}
              onFilterClick={() => setShowFilterModal(true)}
              hasActiveOptions={currentData.hasActiveFilters}
              filters={currentData.filters}
              setFilters={currentData.setFilters}
              loading={currentData.loading}
            />
          }
          mobileContent={
            <ArchiveBottomSheetContent
              searchValue={currentData.searchQuery}
              onSearch={currentData.handleSearch}
              onClearSearch={currentData.clearSearch}
              filters={currentData.filters}
              setFilters={currentData.setFilters}
              availableTags={currentData.availableTags}
            />
          }
        />
      }
    >
      <>
        <BreadcrumbSchema items={[
          {name: 'ホーム', url: 'https://www.noe-room.com/'},
          {name: 'アーカイブ', url: 'https://www.noe-room.com/archives'}
        ]}/>

        <ArchiveSearchResultsSummary
          searchQuery={currentData.searchQuery}
          filters={currentData.filters}
          totalCount={currentData.totalCount}
          onClearAllFilters={currentData.clearAllFilters}
        />

        {/* タブに応じてGrid表示を切り替え */}
        {contentType === ContentType.VIDEOS ? (
          <VideosGrid
            videos={videosData.videos}
            loading={videosData.loading}
            error={videosData.error}
          />
        ) : (
          <StreamsGrid
            streams={streamsData.streams}
            loading={streamsData.loading}
            error={streamsData.error}
            showFeatured={
              !streamsData.searchQuery &&
              (!streamsData.filters.selectedTags || streamsData.filters.selectedTags.length === 0) &&
              !streamsData.filters.startDate &&
              !streamsData.filters.endDate
            }
            isFirstPage={streamsData.currentPage === 1}
          />
        )}

        <Pagination
          currentPage={currentData.currentPage}
          totalPages={currentData.totalPages}
          hasMore={currentData.hasMore}
          onPageChange={currentData.setCurrentPage}
          totalCount={currentData.totalCount}
          pageSize={20}
          loading={currentData.loading}
        />

        {/* Search Modal */}
        <ArchiveSearchOptionsModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={currentData.filters}
          onFiltersChange={currentData.setFilters}
          availableTags={currentData.availableTags}
        />
      </>
    </PageLayout>
  );
}
