'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import type {
  Song,
  MusicStream,
  MusicVideoCard,
  MusicStats,
} from '@/lib/data/types';
import { PageHeader } from '@/components/ui/page-header';
import { ExpandableSearch } from '@/components/ui/toolbar-actions';
import { ToolbarIconButton } from '@/components/ui/toolbar-actions';
import { StateToggle } from '@/components/ui/state-toggle';
import { LoadMore } from '@/components/ui/load-more';
import { MusicStatsDisplay } from './music-stats';
import { LatestFeed } from './latest-feed';
import { SourceTabs } from './source-tabs';
import { StreamGrid } from './stream-grid';
import { SongList } from './song-list';
import { MvGrid } from './mv-grid';
import { SearchResults } from './search-results';
import { useMusicFilter } from '../hooks/use-music-filter';
import type { ViewMode, SongSort, SourceTab } from '../hooks/use-music-filter';
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

const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: 'stream', label: '配信で見る' },
  { key: 'song', label: '曲で見る' },
];

const SORT_OPTIONS: { value: SongSort; label: string }[] = [
  { value: 'count', label: '歌唱回数' },
  { value: 'recent', label: '最終歌唱日' },
  { value: 'name', label: 'あいうえお順' },
];

export function MusicPage({
  songs,
  utawakuStreams,
  concertStreams,
  mvCards,
  stats,
}: Props) {
  const filter = useMusicFilter(songs, utawakuStreams, concertStreams, mvCards);
  const isSearching = filter.search.trim().length > 0;

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

  return (
    <>
      <PageHeader
        title="楽曲ライブラリ"
        description="オリジナル・カバー・歌枠セトリを横断検索"
        right={<MusicStatsDisplay stats={stats} />}
      />

      {/* 横断検索結果 */}
      {isSearching ? (
        <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-lg pb-2xl">
          <SourceTabs
            activeTab={filter.activeTab}
            counts={{
              utawaku: utawakuStreams.length,
              live: concertStreams.length,
              mv: mvCards.length,
            }}
            onSelectTab={filter.setActiveTab}
            toolbarRight={
              <ToolbarRight
                search={filter.search}
                onSearch={filter.updateSearch}
                sortOrder={filter.sortOrder}
                onToggleSort={filter.toggleSort}
                currentCount={filter.currentCount}
              />
            }
          />
          <SearchResults
            query={filter.search.trim()}
            results={filter.crossSearchResults}
          />
        </div>
      ) : (
        <>
          {/* Latest Feed */}
          <LatestFeed
            utawakuStreams={utawakuStreams}
            concertStreams={concertStreams}
            mvCards={mvCards}
            onSelect={handleFeedSelect}
          />

          {/* Database Section */}
          <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-md pb-2xl">
            <SourceTabs
              activeTab={filter.activeTab}
              counts={{
                utawaku: utawakuStreams.length,
                live: concertStreams.length,
                mv: mvCards.length,
              }}
              onSelectTab={filter.setActiveTab}
              toolbarRight={
                <ToolbarRight
                  search={filter.search}
                  onSearch={filter.updateSearch}
                  sortOrder={filter.sortOrder}
                  onToggleSort={filter.toggleSort}
                  currentCount={filter.currentCount}
                />
              }
            />

            {/* 歌枠パネル */}
            {filter.activeTab === 'utawaku' && (
              <>
                <div className="flex items-center justify-between mb-md gap-md">
                  <StateToggle
                    options={VIEW_OPTIONS}
                    activeKey={filter.viewMode}
                    onSelect={filter.setViewMode}
                  />
                  {filter.viewMode === 'song' && (
                    <div className="flex items-center gap-xs">
                      <label className="text-xs text-muted">並び替え</label>
                      <select
                        value={filter.songSort}
                        onChange={(e) =>
                          filter.setSongSort(e.target.value as SongSort)
                        }
                        className="px-2 py-1 font-body text-xs text-interactive bg-surface border border-border rounded-sm outline-none cursor-pointer"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {filter.viewMode === 'stream' ? (
                  <StreamGrid
                    streams={filter.visibleUtawaku}
                    favoriteIds={favoriteIds}
                    onToggleFavorite={handleToggleFavorite}
                    externalSelectedId={pendingVideoId}
                    onClearExternal={clearPendingVideo}
                  />
                ) : (
                  <SongList
                    songs={filter.visibleAggSongs}
                    favoriteIds={favoriteIds}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}
              </>
            )}

            {/* ライブパネル */}
            {filter.activeTab === 'live' && (
              <StreamGrid
                streams={filter.visibleConcerts}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                externalSelectedId={pendingVideoId}
                onClearExternal={clearPendingVideo}
              />
            )}

            {/* MVパネル */}
            {filter.activeTab === 'mv' && (
              <MvGrid
                cards={filter.visibleMvCards}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* ページネーション */}
            {filter.hasMore && (
              <LoadMore
                visibleCount={
                  filter.activeTab === 'utawaku' && filter.viewMode === 'song'
                    ? filter.visibleAggSongs.length
                    : filter.activeTab === 'utawaku'
                      ? filter.visibleUtawaku.length
                      : filter.activeTab === 'live'
                        ? filter.visibleConcerts.length
                        : filter.visibleMvCards.length
                }
                totalCount={filter.filteredTotal}
                onLoadMore={filter.loadMore}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}

function ToolbarRight({
  search,
  onSearch,
  sortOrder,
  onToggleSort,
  currentCount,
}: {
  search: string;
  onSearch: (v: string) => void;
  sortOrder: 'newest' | 'oldest';
  onToggleSort: () => void;
  currentCount: number;
}) {
  return (
    <>
      <ExpandableSearch
        value={search}
        onChange={onSearch}
        placeholder="曲名・アーティスト..."
      />
      <ToolbarIconButton
        title={sortOrder === 'newest' ? '古い順に' : '新しい順に'}
        onClick={onToggleSort}
      >
        <svg
          className={`w-3 h-3 transition-transform duration-250 ease-out-expo ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 2v8M3 7l3 3 3-3" />
        </svg>
      </ToolbarIconButton>
      <span className="font-mono text-3xs text-subtle whitespace-nowrap px-1">
        {currentCount}曲
      </span>
    </>
  );
}
