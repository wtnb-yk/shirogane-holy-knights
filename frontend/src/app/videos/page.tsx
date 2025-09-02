'use client';

import React, { useState } from 'react';
import { useVideos } from '@/features/videos/hooks/useVideos';
import { useStreams } from '@/features/videos/hooks/useStreams';
import { ContentType } from '@/features/videos/types/types';
import { VideosSidebar } from '@/features/videos/components/VideosSidebar';
import { SearchOptionsModal } from '@/features/videos/components/filter/SearchOptionsModal';
import { SearchResultsSummary } from '@/features/videos/components/results/SearchResultsSummary';
import { StatsSummary } from '@/features/videos/components/results/StatsSummary';
import { VideosGrid } from '@/features/videos/components/VideosGrid';
import { StreamsGrid } from '@/features/videos/components/StreamsGrid';
import { Pagination } from '@/components/ui/Pagination';

export default function VideosList() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [contentType, setContentType] = useState<ContentType>(ContentType.STREAMS);
  
  const videosData = useVideos({ pageSize: 20 });
  const streamsData = useStreams({ pageSize: 20 });
  
  // 現在選択されているタブのデータを取得
  const currentData = contentType === ContentType.VIDEOS ? videosData : streamsData;

  return (
    <div className="min-h-screen bg-white">
      {/* メインコンテナ */}
      <div className="flex max-w-full py-8 px-10 gap-10">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          <div className="page-header mb-8">
            <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-wider">
              ARCHIVE
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              配信アーカイブの検索、カテゴリーや日付での絞り込みができます。<br />
              最新の配信はYouTubeチャンネルをご確認ください。
            </p>
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

        {/* サイドバー（右側） */}
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
      </div>
    </div>
  );
}
