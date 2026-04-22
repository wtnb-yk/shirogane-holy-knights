'use client';

import { useCallback, useSyncExternalStore } from 'react';
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
import { usePendingPlay } from '../hooks/use-pending-play';
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

  const {
    pendingVideoId,
    pendingStartSeconds,
    handleFeedSelect,
    clearPending,
  } = usePendingPlay(filter);

  const toolbarRight = (
    <MusicToolbar
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

  return (
    <>
      <PageHeader
        title="楽曲"
        description="歌枠・ライブ・MVを横断検索"
        right={<MusicStatsDisplay stats={stats} />}
      />

      {!isSearching && (
        <LatestFeed
          utawakuStreams={utawakuStreams}
          concertStreams={concertStreams}
          mvCards={mvCards}
          onSelect={handleFeedSelect}
        />
      )}

      <div
        className={`max-w-[var(--content-max)] mx-auto px-md md:px-lg pb-2xl ${isSearching ? 'pt-lg' : 'pt-md'}`}
      >
        <SourceTabs
          activeTab={filter.activeTab}
          counts={tabCounts}
          onSelectTab={filter.setActiveTab}
          search={filter.search}
          onSearch={filter.updateSearch}
          toolbarRight={toolbarRight}
        />
        {isSearching ? (
          <SearchResults
            query={filter.search.trim()}
            results={filter.crossSearchResults}
          />
        ) : (
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
            pendingStartSeconds={pendingStartSeconds}
            onClearPendingVideo={clearPending}
            hasMore={filter.hasMore}
            filteredTotal={filter.filteredTotal}
            visibleCount={filter.visibleItemCount}
            onLoadMore={filter.loadMore}
          />
        )}
      </div>
    </>
  );
}
