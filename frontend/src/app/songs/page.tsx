'use client';

import React, { useState } from 'react';
import { useStreamSongs } from '@/features/songs/hooks/useStreamSongs';
import { StreamSongsGrid } from '@/features/songs/components/StreamSongsGrid';
import { SongSearchResultsSummary } from '@/features/songs/components/SongSearchResultsSummary';
import { SongStatsSummary } from '@/features/songs/components/SongStatsSummary';
import { SongSearchOptionsModal } from '@/features/songs/components/SongSearchOptionsModal';
import { PerformanceListModal } from '@/features/songs/components/PerformanceListModal';
import { SongsSidebar } from '@/features/songs/components/SongsSidebar';
import { ViewToggleButton } from '@/features/songs/components/ViewToggleButton';
import { PlayerSection } from '@/features/songs/components/PlayerSection';
import { Pagination } from '@/components/ui/Pagination';
import { StreamSong, ViewMode } from '@/features/songs/types/types';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { MobileDropdownSongsSection } from '@/components/common/Sidebar/MobileDropdownSongsSection';
import { useCurrentSong } from '@/features/songs/hooks/useCurrentSong';

export default function SongsList() {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<StreamSong | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  
  // 楽曲データの取得
  const songsData = useStreamSongs({ 
    pageSize: 20
  });

  // 現在の楽曲状態管理
  const { currentSong, changeCurrentSong } = useCurrentSong();
  
  // 楽曲データが読み込まれたら最初の楽曲を選択
  React.useEffect(() => {
    if (songsData.songs.length > 0 && !currentSong) {
      changeCurrentSong(songsData.songs[0]);
    }
  }, [songsData.songs, currentSong, changeCurrentSong]);
  
  const handleSongClick = (song: StreamSong) => {
    // 楽曲カードクリック時：楽曲を選択してプレイヤーで再生
    changeCurrentSong(song);
  };

  const handleSongDetailsClick = (song: StreamSong) => {
    // 詳細表示：パフォーマンスモーダルを開く
    setSelectedSong(song);
    setShowPerformanceModal(true);
  };

  // アクティブなフィルター数を計算
  const activeFiltersCount = (songsData.searchQuery ? 1 : 0) + 
    (songsData.filters.startDate || songsData.filters.endDate ? 1 : 0) +
    (songsData.sortBy !== 'singCount' || songsData.sortOrder !== 'DESC' ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* メインコンテナ */}
      <div className="flex flex-col md:flex-row max-w-full py-8 px-10 gap-10">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          <div className="page-header mb-6">
            <h1 className="text-5xl font-black text-text-primary mb-3 tracking-wider">
              SONG
            </h1>
            
            {/* スマホサイズではボタンをタイトル下に表示 */}
            <div className="sm:hidden mb-4 flex gap-2">
              <ViewToggleButton
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              <MobileSidebarButton 
                onClick={() => setIsSidebarOpen(true)}
                hasActiveFilters={activeFiltersCount > 0}
                activeFiltersCount={activeFiltersCount}
                variant="search"
              />
            </div>
            
            {/* タブレット以上では説明文とボタンを横並び */}
            <div className="hidden sm:flex items-start justify-between gap-4 mb-4">
              <p className="text-sm text-text-secondary leading-relaxed flex-1">
                歌枠で歌われた曲を検索・閲覧できます。<br />
                楽曲名・アーティスト名での検索、歌唱回数や最新歌唱日での並び替えが可能です。
              </p>
              
              {/* 表示切り替えボタン */}
              <ViewToggleButton
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              {/* タブレット用メニューボタン（lg未満のみ表示） */}
              <div className="lg:hidden relative">
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
                    <MobileDropdownSongsSection
                      searchValue={songsData.searchQuery}
                      onSearch={songsData.handleSearch}
                      onClearSearch={songsData.clearSearch}
                      sortBy={songsData.sortBy}
                      sortOrder={songsData.sortOrder}
                      filters={songsData.filters}
                      onSortChange={songsData.handleSortChange}
                      onFiltersChange={songsData.setFilters}
                    />
                  }
                >
                  <SongsSidebar
                    searchValue={songsData.searchQuery}
                    onSearch={songsData.handleSearch}
                    onClearSearch={songsData.clearSearch}
                    onOptionsClick={() => setShowOptionsModal(true)}
                    hasActiveOptions={!!(songsData.filters.startDate || songsData.filters.endDate || songsData.sortBy !== 'singCount' || songsData.sortOrder !== 'DESC')}
                    filters={songsData.filters}
                    onFiltersChange={songsData.setFilters}
                  />
                </ResponsiveSidebar>
              </div>
            </div>
          </div>

          <SongSearchResultsSummary
            searchQuery={songsData.searchQuery}
            totalCount={songsData.totalCount}
            filters={songsData.filters}
            onClearSearch={songsData.clearSearch}
            onClearAllFilters={songsData.clearAllFilters}
          />

          {/* YouTube プレイヤーセクション */}
          <div className="mb-8">
            <PlayerSection 
              currentSong={currentSong} 
              loading={songsData.loading}
            />
          </div>

          <StreamSongsGrid 
            songs={songsData.songs} 
            loading={songsData.loading} 
            error={songsData.error}
            viewMode={viewMode}
            onSongClick={handleSongDetailsClick}
            onSongPlayClick={handleSongClick}
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

        {/* デスクトップサイドバー */}
        <ResponsiveSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        >
          <SongsSidebar
            searchValue={songsData.searchQuery}
            onSearch={songsData.handleSearch}
            onClearSearch={songsData.clearSearch}
            onOptionsClick={() => setShowOptionsModal(true)}
            hasActiveOptions={!!(songsData.filters.startDate || songsData.filters.endDate || songsData.sortBy !== 'singCount' || songsData.sortOrder !== 'DESC')}
            filters={songsData.filters}
            onFiltersChange={songsData.setFilters}
          />
        </ResponsiveSidebar>
      </div>
    </div>
  );
}