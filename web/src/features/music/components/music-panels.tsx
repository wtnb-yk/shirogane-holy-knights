import { LoadMore } from '@/components/ui/load-more';
import { StreamGrid } from './stream-grid';
import { SongList } from './song-list';
import { MvGrid } from './mv-grid';
import { UtawakuToolbar } from './utawaku-toolbar';
import type { ViewMode, SongSort, SourceTab } from '../hooks/use-music-filter';
import type { AggregatedSong } from '../hooks/use-music-filter';
import type { MusicStream, MusicVideoCard } from '@/lib/data/types';

type Props = {
  activeTab: SourceTab;
  viewMode: ViewMode;
  songSort: SongSort;
  onSetViewMode: (mode: ViewMode) => void;
  onSetSongSort: (sort: SongSort) => void;
  visibleUtawaku: MusicStream[];
  visibleConcerts: MusicStream[];
  visibleMvCards: MusicVideoCard[];
  visibleAggSongs: AggregatedSong[];
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
  pendingVideoId: string | null;
  pendingStartSeconds: number | null;
  onClearPendingVideo: () => void;
  hasMore: boolean;
  filteredTotal: number;
  visibleCount: number;
  onLoadMore: () => void;
};

export function MusicPanels({
  activeTab,
  viewMode,
  songSort,
  onSetViewMode,
  onSetSongSort,
  visibleUtawaku,
  visibleConcerts,
  visibleMvCards,
  visibleAggSongs,
  favoriteIds,
  onToggleFavorite,
  pendingVideoId,
  pendingStartSeconds,
  onClearPendingVideo,
  hasMore,
  filteredTotal,
  visibleCount,
  onLoadMore,
}: Props) {
  return (
    <>
      {/* 歌枠パネル */}
      {activeTab === 'utawaku' && (
        <>
          <UtawakuToolbar
            viewMode={viewMode}
            songSort={songSort}
            onSetViewMode={onSetViewMode}
            onSetSongSort={onSetSongSort}
          />
          {viewMode === 'stream' ? (
            <StreamGrid
              streams={visibleUtawaku}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              externalSelectedId={pendingVideoId}
              onClearExternal={onClearPendingVideo}
              externalStartSeconds={pendingStartSeconds}
            />
          ) : (
            <SongList
              songs={visibleAggSongs}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </>
      )}

      {/* ライブパネル */}
      {activeTab === 'live' && (
        <StreamGrid
          streams={visibleConcerts}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
          externalSelectedId={pendingVideoId}
          onClearExternal={onClearPendingVideo}
        />
      )}

      {/* MVパネル */}
      {activeTab === 'mv' && (
        <MvGrid
          cards={visibleMvCards}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {/* ページネーション */}
      {hasMore && (
        <LoadMore
          visibleCount={visibleCount}
          totalCount={filteredTotal}
          onLoadMore={onLoadMore}
        />
      )}
    </>
  );
}
