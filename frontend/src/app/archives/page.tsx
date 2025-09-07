'use client';

import React, { useState } from 'react';
import { useVideos } from '@/features/archives/hooks/useVideos';
import { useStreams } from '@/features/archives/hooks/useStreams';
import { ContentType } from '@/features/archives/types/types';
import { VideosSidebar } from '@/features/archives/components/VideosSidebar';
import { SearchOptionsModal } from '@/features/archives/components/filter/SearchOptionsModal';
import { SearchResultsSummary } from '@/features/archives/components/results/SearchResultsSummary';
import { StatsSummary } from '@/features/archives/components/results/StatsSummary';
import { VideosGrid } from '@/features/archives/components/VideosGrid';
import { StreamsGrid } from '@/features/archives/components/StreamsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { BottomSheetHeader } from '@/components/common/BottomSheet/BottomSheetHeader';
import { VideosBottomSheetContent } from '@/features/archives/components/VideosBottomSheetContent';
import { PageLayout } from '@/components/common/PageLayout';

export default function VideosList() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [contentType, setContentType] = useState<ContentType>(ContentType.STREAMS);
  
  const videosData = useVideos({ pageSize: 20 });
  const streamsData = useStreams({ pageSize: 20 });
  
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
          配信アーカイブの検索、カテゴリーや日付での絞り込みができます。<br />
          最新の配信はYouTubeチャンネルをご確認ください。
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
          <VideosSidebar
            contentType={contentType}
            onContentTypeChange={setContentType}
            searchValue={currentData.searchQuery}
            onSearch={currentData.handleSearch}
            onClearSearch={currentData.clearSearch}
            onFilterClick={() => setShowFilterModal(true)}
            hasActiveOptions={currentData.hasActiveFilters}
            filters={currentData.filters}
            setFilters={currentData.setFilters}
          />
        </ResponsiveSidebar>
      }
    >
      <>

          <SearchResultsSummary
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

          {currentData.totalCount > 20 && (
            <Pagination
              currentPage={currentData.currentPage}
              totalPages={currentData.totalPages}
              hasMore={currentData.hasMore}
              onPageChange={currentData.setCurrentPage}
              size="sm"
            />
          )}

          <StatsSummary
            currentPage={currentData.currentPage}
            totalCount={currentData.totalCount}
            pageSize={20}
            loading={currentData.loading}
          />

        <SearchOptionsModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={currentData.filters}
          onFiltersChange={currentData.setFilters}
          availableTags={currentData.availableTags}
        />

        {/* BottomSheet */}
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
        >
          <BottomSheetHeader
            title="検索・絞り込み"
            onClose={() => setIsBottomSheetOpen(false)}
          />
          <VideosBottomSheetContent
            contentType={contentType}
            onContentTypeChange={setContentType}
            searchValue={currentData.searchQuery}
            onSearch={currentData.handleSearch}
            onClearSearch={currentData.clearSearch}
            filters={currentData.filters}
            setFilters={currentData.setFilters}
            availableTags={currentData.availableTags}
          />
        </BottomSheet>
      </>
    </PageLayout>
  );
}