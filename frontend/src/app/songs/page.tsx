'use client';

import React, { useState } from 'react';
import { useStreamSongs } from '@/features/songs/hooks/useStreamSongs';
import { useConcertSongs } from '@/features/songs/hooks/useConcertSongs';
import { StreamSongsGrid } from '@/features/songs/components/StreamSongsGrid';
import { SongSearchResultsSummary } from '@/features/songs/components/SongSearchResultsSummary';
import { SongStatsSummary } from '@/features/songs/components/SongStatsSummary';
import { SongSearchOptionsModal } from '@/features/songs/components/SongSearchOptionsModal';
import { PerformanceListModal } from '@/features/songs/components/PerformanceListModal';
import { SongsSidebar } from '@/features/songs/components/SongsSidebar';
import { ViewToggleButton } from '@/features/songs/components/ViewToggleButton';
import { PlayerSection } from '@/features/songs/components/PlayerSection';
import { Pagination } from '@/components/ui/Pagination';
import { StreamSong, ViewMode, SongContentType } from '@/features/songs/types/types';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { SongsBottomSheetContent } from '@/features/songs/components/SongsBottomSheetContent';
import { useCurrentSong } from '@/features/songs/hooks/useCurrentSong';
import { PageLayout } from '@/components/common/PageLayout';
import { ContentTypeTabs } from '@/components/common/Sidebar/components/ContentTypeTabs';

export default function SongsList() {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<StreamSong | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  const [songContentType, setSongContentType] = useState<SongContentType>(SongContentType.CONCERT);
  
  // 楽曲データの取得
  const streamSongsData = useStreamSongs({ 
    pageSize: 20
  });
  
  const concertSongsData = useConcertSongs({
    pageSize: 20
  });
  
  // 現在選択されているタブのデータを取得
  const currentData = songContentType === SongContentType.STREAM ? streamSongsData : concertSongsData;

  // プレイヤー状態管理
  const { currentSong, currentPerformance, autoplay, changeCurrentSong, playSong } = useCurrentSong();
  
  
  // 初回読み込み時のみランダムな楽曲を選択（検索・ページング変更では影響されない）
  React.useEffect(() => {
    if (currentData.songs.length > 0 && !currentSong && !currentData.loading) {
      const randomIndex = Math.floor(Math.random() * currentData.songs.length);
      changeCurrentSong(currentData.songs[randomIndex]);
    }
  }, [currentData.songs.length > 0, currentSong, changeCurrentSong, currentData.loading]);
  
  const handleSongPlayClick = (song: StreamSong) => {
    // 再生ボタンクリック時：自動再生で楽曲を開始
    playSong(song);
  };

  const handleSongDetailsClick = (song: StreamSong) => {
    // 詳細表示：パフォーマンスモーダルを開く
    setSelectedSong(song);
    setShowPerformanceModal(true);
  };

  // アクティブなフィルター数を計算
  const activeFiltersCount = (currentData.searchQuery ? 1 : 0) + 
    (currentData.filters.startDate || currentData.filters.endDate ? 1 : 0) +
    (currentData.sortBy !== 'latestSingDate' || currentData.sortOrder !== 'DESC' ? 1 : 0);

  return (
    <PageLayout
      title="SONG"
      description={
        <p>
          白銀ノエルさんが歌枠や記念ライブで歌った曲を検索・閲覧できます。<br />
          楽曲名・アーティスト名での検索、歌唱回数や最新歌唱日での並び替えが可能です。
        </p>
      }
      headerActions={
        <>
          {/* 表示切り替えボタン */}
          <ViewToggleButton
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {/* タブレット用メニューボタン（lg未満のみ表示） */}
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
                <SongsBottomSheetContent
                  searchValue={currentData.searchQuery}
                  onSearch={currentData.handleSearch}
                  onClearSearch={currentData.clearSearch}
                  sortBy={currentData.sortBy}
                  sortOrder={currentData.sortOrder}
                  filters={currentData.filters}
                  onSortChange={currentData.handleSortChange}
                  onFiltersChange={currentData.setFilters}
                  songContentType={songContentType}
                  onSongContentTypeChange={setSongContentType}
                />
              }
            >
              <SongsSidebar
                songContentType={songContentType}
                onSongContentTypeChange={setSongContentType}
                searchValue={currentData.searchQuery}
                onSearch={currentData.handleSearch}
                onClearSearch={currentData.clearSearch}
                onOptionsClick={() => setShowOptionsModal(true)}
                hasActiveOptions={!!(currentData.filters.startDate || currentData.filters.endDate || currentData.sortBy !== 'latestSingDate' || currentData.sortOrder !== 'DESC')}
                filters={currentData.filters}
                onFiltersChange={currentData.setFilters}
              />
            </ResponsiveSidebar>
          </div>
        </>
      }
      mobileActions={
        <MobileSidebarButton 
          onClick={() => setIsSidebarOpen(true)}
          hasActiveFilters={activeFiltersCount > 0}
          activeFiltersCount={activeFiltersCount}
          variant="search"
        />
      }
      mobileRightActions={
        <ViewToggleButton
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
      primaryTabs={
        <ContentTypeTabs
          tabs={[
            { value: SongContentType.CONCERT, label: 'ライブ' },
            { value: SongContentType.STREAM, label: '歌枠' }
          ]}
          activeTab={songContentType}
          onTabChange={(value) => setSongContentType(value as SongContentType)}
          size="md"
          variant="compact"
        />
      }
      sidebar={
        <ResponsiveSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          mobileContent={
            <SongsBottomSheetContent
              searchValue={currentData.searchQuery}
              onSearch={currentData.handleSearch}
              onClearSearch={currentData.clearSearch}
              sortBy={currentData.sortBy}
              sortOrder={currentData.sortOrder}
              filters={currentData.filters}
              onSortChange={currentData.handleSortChange}
              onFiltersChange={currentData.setFilters}
              songContentType={songContentType}
              onSongContentTypeChange={setSongContentType}
            />
          }
        >
          <SongsSidebar
            songContentType={songContentType}
            onSongContentTypeChange={setSongContentType}
            searchValue={currentData.searchQuery}
            onSearch={currentData.handleSearch}
            onClearSearch={currentData.clearSearch}
            onOptionsClick={() => setShowOptionsModal(true)}
            hasActiveOptions={!!(currentData.filters.startDate || currentData.filters.endDate || currentData.sortBy !== 'latestSingDate' || currentData.sortOrder !== 'DESC')}
            filters={currentData.filters}
            onFiltersChange={currentData.setFilters}
          />
        </ResponsiveSidebar>
      }
    >
      <>

          <SongSearchResultsSummary
            searchQuery={currentData.searchQuery}
            totalCount={currentData.totalCount}
            filters={currentData.filters}
            onClearSearch={currentData.clearSearch}
            onClearAllFilters={currentData.clearAllFilters}
          />

          {/* YouTube プレイヤーセクション */}
          <div className="mb-4 -mx-2 lg:mx-0">
            <PlayerSection 
              currentSong={currentSong} 
              currentPerformance={currentPerformance}
              autoplay={autoplay}
            />
          </div>

          <StreamSongsGrid 
            songs={currentData.songs} 
            loading={currentData.loading} 
            error={currentData.error}
            viewMode={viewMode}
            onSongClick={handleSongDetailsClick}
            onSongPlayClick={handleSongPlayClick}
          />

          {currentData.totalCount > 20 && (
            <Pagination
              currentPage={currentData.currentPage}
              totalPages={currentData.totalPages}
              hasMore={currentData.hasMore}
              onPageChange={currentData.setCurrentPage}
              size="sm"
            />
          )}

          <SongStatsSummary
            currentPage={currentData.currentPage}
            totalCount={currentData.totalCount}
            pageSize={20}
            loading={currentData.loading}
          />

          <SongSearchOptionsModal
            isOpen={showOptionsModal}
            onClose={() => setShowOptionsModal(false)}
            sortBy={currentData.sortBy}
            sortOrder={currentData.sortOrder}
            filters={currentData.filters}
            onSortChange={currentData.handleSortChange}
            onFiltersChange={currentData.setFilters}
          />
          
        <PerformanceListModal 
          song={selectedSong}
          open={showPerformanceModal}
          onOpenChange={setShowPerformanceModal}
          onPerformancePlay={(song, performance) => {
            playSong(song, performance);
          }}
        />
      </>
    </PageLayout>
  );
}
