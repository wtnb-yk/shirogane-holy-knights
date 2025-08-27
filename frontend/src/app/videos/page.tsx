'use client';

import React, { useState } from 'react';
import { useVideos } from '@/features/videos/hooks/useVideos';
import { useStreams } from '@/features/videos/hooks/useStreams';
import { ContentType } from '@/features/videos/types/types';
import { SearchBar } from '@/features/videos/components/SearchBar';
import { FilterModal } from '@/features/videos/components/filter/FilterModal';
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
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 opacity-0 animate-slide-up">
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-text-primary">
              配信・動画
            </h1>
          </div>
          
          {/* タブ切り替えUI */}
          <div className="flex border-b border-surface-border">
            <button
              onClick={() => setContentType(ContentType.STREAMS)}
              className={`px-4 md:px-6 py-2 md:py-3 font-medium transition-all duration-200 border-b-2 text-sm md:text-base ${
                contentType === ContentType.STREAMS 
                  ? 'text-text-primary border-text-secondary bg-bg-accent/30' 
                  : 'text-text-secondary border-transparent hover:text-text-primary hover:border-surface-border'
              }`}
            >
              配信
            </button>
            <button
              onClick={() => setContentType(ContentType.VIDEOS)}
              className={`px-4 md:px-6 py-2 md:py-3 font-medium transition-all duration-200 border-b-2 text-sm md:text-base ${
                contentType === ContentType.VIDEOS 
                  ? 'text-text-primary border-text-secondary bg-bg-accent/30' 
                  : 'text-text-secondary border-transparent hover:text-text-primary hover:border-surface-border'
              }`}
            >
              動画
            </button>
          </div>
        </div>

        <SearchBar 
          searchValue={currentData.searchQuery}
          onSearch={currentData.handleSearch}
          onClearSearch={currentData.clearSearch}
          onFilterClick={() => setShowFilterModal(true)}
        />

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

        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={currentData.filters}
          onFiltersChange={currentData.setFilters}
          availableTags={currentData.availableTags}
        />
      </div>
    </div>
  );
}
