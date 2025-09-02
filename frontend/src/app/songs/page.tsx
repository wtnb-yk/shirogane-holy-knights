'use client';

import React, { useState } from 'react';
import { useStreamSongs } from '@/features/songs/hooks/useStreamSongs';
import { StreamSongsGrid } from '@/features/songs/components/StreamSongsGrid';
import { SongSearchResultsSummary } from '@/features/songs/components/SongSearchResultsSummary';
import { SongStatsSummary } from '@/features/songs/components/SongStatsSummary';
import { SongSearchOptionsModal } from '@/features/songs/components/SongSearchOptionsModal';
import { PerformanceListModal } from '@/features/songs/components/PerformanceListModal';
import { SongsSidebar } from '@/features/songs/components/SongsSidebar';
import { Pagination } from '@/components/ui/Pagination';
import { StreamSong } from '@/features/songs/types/types';

export default function SongsList() {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<StreamSong | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  
  const handleSongClick = (song: StreamSong) => {
    setSelectedSong(song);
    setShowPerformanceModal(true);
  };
  
  const songsData = useStreamSongs({ pageSize: 20 });

  return (
    <div className="min-h-screen bg-white">
      {/* メインコンテナ */}
      <div className="flex max-w-full py-8 px-10 gap-10">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          <div className="page-header mb-8">
            <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-wider">
              SONG
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              歌枠で歌われた曲を検索・閲覧できます。<br />
              楽曲名・アーティスト名での検索、歌唱回数や最新歌唱日での並び替えが可能です。
            </p>
          </div>

          <SongSearchResultsSummary
            searchQuery={songsData.searchQuery}
            totalCount={songsData.totalCount}
            filters={songsData.filters}
            onClearSearch={songsData.clearSearch}
            onClearAllFilters={songsData.clearAllFilters}
          />

          <StreamSongsGrid 
            songs={songsData.songs} 
            loading={songsData.loading} 
            error={songsData.error}
            onSongClick={handleSongClick}
          />

          {songsData.totalCount > 20 && (
            <Pagination
              currentPage={songsData.currentPage}
              totalPages={songsData.totalPages}
              hasMore={songsData.hasMore}
              onPageChange={songsData.setCurrentPage}
              size="sm"
            />
          )}

          <SongStatsSummary
            currentPage={songsData.currentPage}
            totalCount={songsData.totalCount}
            pageSize={20}
            loading={songsData.loading}
          />

          <SongSearchOptionsModal
            isOpen={showOptionsModal}
            onClose={() => setShowOptionsModal(false)}
            sortBy={songsData.sortBy}
            sortOrder={songsData.sortOrder}
            filters={songsData.filters}
            onSortChange={songsData.handleSortChange}
            onFiltersChange={songsData.setFilters}
          />
          
          <PerformanceListModal 
            song={selectedSong}
            open={showPerformanceModal}
            onOpenChange={setShowPerformanceModal}
          />
        </main>

        {/* サイドバー（右側） */}
        <SongsSidebar
          searchValue={songsData.searchQuery}
          onSearch={songsData.handleSearch}
          onClearSearch={songsData.clearSearch}
          onOptionsClick={() => setShowOptionsModal(true)}
          hasActiveOptions={!!(songsData.filters.startDate || songsData.filters.endDate || songsData.sortBy !== 'singCount' || songsData.sortOrder !== 'DESC')}
        />
      </div>
    </div>
  );
}
