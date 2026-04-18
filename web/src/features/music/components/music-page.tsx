'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import type {
  Song,
  MusicStream,
  MusicVideoCard,
  MusicStats,
} from '@/lib/data/types';
import { PageHeader } from '@/components/ui/page-header';
import { MusicStatsDisplay } from './music-stats';
import { LatestFeed } from './latest-feed';
import { SourceTabs } from './source-tabs';
import { MusicToolbar } from './music-toolbar';
import { MusicPanels } from './music-panels';
import { SearchResults } from './search-results';
import { useMusicFilter } from '../hooks/use-music-filter';
import type { SourceTab } from '../hooks/use-music-filter';
import {
  getFavoritesSnapshot,
  getFavoritesServerSnapshot,
  subscribeFavorites,
  toggleFavorite,
} from '../lib/favorite-songs';

type Props = {
  songs: Song[];
  utawakuStreams: MusicStream[];
  concertStreams: MusicStream[];
  mvCards: MusicVideoCard[];
  stats: MusicStats;
};

export function MusicPage({
  songs,
  utawakuStreams,
  concertStreams,
  mvCards,
  stats,
}: Props) {
  // いいね状態
  const favoriteIds = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot,
  );
  const handleToggleFavorite = useCallback(
    (songId: string) => toggleFavorite(songId),
    [],
  );

  const filter = useMusicFilter(
    songs,
    utawakuStreams,
    concertStreams,
    mvCards,
    favoriteIds,
  );
  const isSearching = filter.search.trim().length > 0;

  // フィードカード → タブ切替 + カード展開
  const [pendingVideoId, setPendingVideoId] = useState<string | null>(null);

  const handleFeedSelect = useCallback(
    (type: SourceTab, videoId: string) => {
      filter.setActiveTab(type);
      if (type === 'utawaku' || type === 'live') {
        filter.setViewMode('stream');
        setPendingVideoId(videoId);
      }
    },
    [filter],
  );

  const clearPendingVideo = useCallback(() => setPendingVideoId(null), []);

  const toolbarRight = (
    <MusicToolbar
      search={filter.search}
      onSearch={filter.updateSearch}
      sortOrder={filter.sortOrder}
      onToggleSort={filter.toggleSort}
      favOnly={filter.favOnly}
      onToggleFavOnly={filter.toggleFavOnly}
      currentCount={filter.currentCount}
    />
  );

  const tabCounts = {
    utawaku: utawakuStreams.length,
    live: concertStreams.length,
    mv: mvCards.length,
  };

  const panelVisibleCount =
    filter.activeTab === 'utawaku' && filter.viewMode === 'song'
      ? filter.visibleAggSongs.length
      : filter.activeTab === 'utawaku'
        ? filter.visibleUtawaku.length
        : filter.activeTab === 'live'
          ? filter.visibleConcerts.length
          : filter.visibleMvCards.length;

  return (
    <>
      <PageHeader
        title="楽曲"
        description="オリジナル・カバー・歌枠セトリを横断検索"
        right={<MusicStatsDisplay stats={stats} />}
      />

      {isSearching ? (
        <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-lg pb-2xl">
          <SourceTabs
            activeTab={filter.activeTab}
            counts={tabCounts}
            onSelectTab={filter.setActiveTab}
            toolbarRight={toolbarRight}
          />
          <SearchResults
            query={filter.search.trim()}
            results={filter.crossSearchResults}
          />
        </div>
      ) : (
        <>
          <LatestFeed
            utawakuStreams={utawakuStreams}
            concertStreams={concertStreams}
            mvCards={mvCards}
            onSelect={handleFeedSelect}
          />

          <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-md pb-2xl">
            <SourceTabs
              activeTab={filter.activeTab}
              counts={tabCounts}
              onSelectTab={filter.setActiveTab}
              toolbarRight={toolbarRight}
            />
            <MusicPanels
              activeTab={filter.activeTab}
              viewMode={filter.viewMode}
              songSort={filter.songSort}
              onSetViewMode={filter.setViewMode}
              onSetSongSort={filter.setSongSort}
              visibleUtawaku={filter.visibleUtawaku}
              visibleConcerts={filter.visibleConcerts}
              visibleMvCards={filter.visibleMvCards}
              visibleAggSongs={filter.visibleAggSongs}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              pendingVideoId={pendingVideoId}
              onClearPendingVideo={clearPendingVideo}
              hasMore={filter.hasMore}
              filteredTotal={filter.filteredTotal}
              visibleCount={panelVisibleCount}
              onLoadMore={filter.loadMore}
            />
          </div>
        </>
      )}
    </>
  );
}
