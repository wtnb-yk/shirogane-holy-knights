'use client';

import React, { useState } from 'react';
import { usePerformedSongs } from '@/features/songs/hooks/usePerformedSongs';
import { SongSearchBar } from '@/features/songs/components/SongSearchBar';
import { PerformedSongsGrid } from '@/features/songs/components/PerformedSongsGrid';
import { SongSearchResultsSummary } from '@/features/songs/components/SongSearchResultsSummary';
import { SongStatsSummary } from '@/features/songs/components/SongStatsSummary';
import { SongSortModal } from '@/features/songs/components/SongSortModal';
import { PerformanceListModal } from '@/features/songs/components/PerformanceListModal';
import { Pagination } from '@/components/ui/Pagination';
import { PerformedSong } from '@/features/songs/types/types';

export default function SongsList() {
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<PerformedSong | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  
  const handleSongClick = (song: PerformedSong) => {
    setSelectedSong(song);
    setShowPerformanceModal(true);
  };
  
  const songsData = usePerformedSongs({ pageSize: 20 });

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 opacity-0 animate-slide-up">
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-text-primary">
              歌
            </h1>
          </div>
        </div>

        <SongSearchBar 
          searchValue={songsData.searchQuery}
          onSearch={songsData.handleSearch}
          onClearSearch={songsData.clearSearch}
          sortBy={songsData.sortBy}
          sortOrder={songsData.sortOrder}
          onSortChange={songsData.handleSortChange}
          onSortClick={() => setShowSortModal(true)}
        />

        <SongSearchResultsSummary
          searchQuery={songsData.searchQuery}
          totalCount={songsData.totalCount}
          sortBy={songsData.sortBy}
          sortOrder={songsData.sortOrder}
          onClearSearch={songsData.clearSearch}
        />

        <PerformedSongsGrid 
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

        <SongSortModal
          isOpen={showSortModal}
          onClose={() => setShowSortModal(false)}
          sortBy={songsData.sortBy}
          sortOrder={songsData.sortOrder}
          onSortChange={songsData.handleSortChange}
        />
        
        <PerformanceListModal 
          song={selectedSong}
          open={showPerformanceModal}
          onOpenChange={setShowPerformanceModal}
        />
      </div>
    </div>
  );
}
