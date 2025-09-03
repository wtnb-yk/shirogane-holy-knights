'use client';

import React, { useState } from 'react';
import { useVideos } from '@/features/streams/hooks/useVideos';
import { useStreams } from '@/features/streams/hooks/useStreams';
import { ContentType } from '@/features/streams/types/types';
import { VideosSidebar } from '@/features/streams/components/VideosSidebar';
import { SearchOptionsModal } from '@/features/streams/components/filter/SearchOptionsModal';
import { SearchResultsSummary } from '@/features/streams/components/results/SearchResultsSummary';
import { StatsSummary } from '@/features/streams/components/results/StatsSummary';
import { VideosGrid } from '@/features/streams/components/VideosGrid';
import { StreamsGrid } from '@/features/streams/components/StreamsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { MobileDropdownVideosSection } from '@/components/common/Sidebar/MobileDropdownVideosSection';

export default function VideosList() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contentType, setContentType] = useState<ContentType>(ContentType.STREAMS);
  
  const videosData = useVideos({ pageSize: 20 });
  const streamsData = useStreams({ pageSize: 20 });
  
  // 現在選択されているタブのデータを取得
  const currentData = contentType === ContentType.VIDEOS ? videosData : streamsData;

  // アクティブなフィルター数を計算
  const activeFiltersCount = (currentData.filters.selectedTags?.length || 0) + 
    (currentData.searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* メインコンテナ */}
      <div className="flex flex-col md:flex-row max-w-full py-8 px-10 gap-10">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          <div className="page-header mb-6">
            <h1 className="text-5xl font-black text-text-primary mb-3 tracking-wider">
              ARCHIVE
            </h1>
            
            {/* 説明文とモバイルボタンを同じ行に配置 */}
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-text-secondary leading-relaxed flex-1">
                配信アーカイブの検索、カテゴリーや日付での絞り込みができます。<br />
                最新の配信はYouTubeチャンネルをご確認ください。
              </p>
              
              {/* モバイルメニューボタン（lg未満のみ表示） */}
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
                    <MobileDropdownVideosSection
                      contentType={contentType}
                      onContentTypeChange={setContentType}
                      searchValue={currentData.searchQuery}
                      onSearch={currentData.handleSearch}
                      onClearSearch={currentData.clearSearch}
                      filters={currentData.filters}
                      setFilters={currentData.setFilters}
                      availableTags={currentData.availableTags}
                    />
                  }
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
              </div>
            </div>
          </div>

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
                (!streamsData.filters.selectedTags || streamsData.filters.selectedTags.length === 0)
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
        </main>

        {/* デスクトップサイドバー */}
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
      </div>
    </div>
  );
}
