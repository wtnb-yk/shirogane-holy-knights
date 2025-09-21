'use client';

import React, { useState } from 'react';
import { useStreamSongs } from '@/features/songs/hooks/useStreamSongs';
import { useConcertSongs } from '@/features/songs/hooks/useConcertSongs';
import { StreamSongsList } from '@/features/songs/components/StreamSongsList';
import { SongSearchResultsSummary } from '@/features/songs/components/SongSearchResultsSummary';
import { SongStatsSummary } from '@/features/songs/components/SongStatsSummary';
import { SongSearchOptionsModal } from '@/features/songs/components/SongSearchOptionsModal';
import { SongDetailModal } from '@/features/songs/components/SongDetailModal';
import { SongsSidebar } from '@/features/songs/components/SongsSidebar';
import { PlayerSection } from '@/features/songs/components/PlayerSection';
import { Pagination } from '@/components/ui/Pagination';
import { StreamSong, SongContentType } from '@/features/songs/types/types';
import { MobileSidebarButton } from '@/components/common/Sidebar/MobileSidebarButton';
import { ResponsiveSidebar } from '@/components/common/Sidebar/ResponsiveSidebar';
import { SongsBottomSheetContent } from '@/features/songs/components/SongsBottomSheetContent';
import { useCurrentSong } from '@/features/songs/hooks/useCurrentSong';
import { PageLayout } from '@/components/common/PageLayout';
import { ContentTypeTabs } from '@/components/common/Sidebar/components/ContentTypeTabs';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

export default function SongsList() {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<StreamSong | null>(null);
  const [showSongDetailModal, setShowSongDetailModal] = useState(false);
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
      const selectedSong = currentData.songs[randomIndex];
      if (selectedSong) {
        changeCurrentSong(selectedSong);
      }
    }
  }, [currentData.songs, currentSong, changeCurrentSong, currentData.loading]);
  
  const handleSongDetailsClick = (song: StreamSong) => {
    // 詳細表示：楽曲詳細モーダルを開く
    setSelectedSong(song);
    setShowSongDetailModal(true);
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
      mobileRightActions={null}
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
        <BreadcrumbSchema items={[
          { name: 'ホーム', url: 'https://www.noe-room.com/' },
          { name: '楽曲', url: 'https://www.noe-room.com/songs' }
        ]} />

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

          <StreamSongsList 
            songs={currentData.songs} 
            loading={currentData.loading} 
            error={currentData.error}
            onSongClick={handleSongDetailsClick}
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
          
        <SongDetailModal
          song={selectedSong}
          isOpen={showSongDetailModal}
          onClose={() => setShowSongDetailModal(false)}
          onPerformancePlay={(song, performance) => {
            playSong(song, performance);
          }}
        />
      </>
    </PageLayout>
  );
}
