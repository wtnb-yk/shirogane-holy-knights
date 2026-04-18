import { StateToggle } from '@/components/ui/state-toggle';
import { LoadMore } from '@/components/ui/load-more';
import { StreamGrid } from './stream-grid';
import { SongList } from './song-list';
import { MvGrid } from './mv-grid';
import type { ViewMode, SongSort, SourceTab } from '../hooks/use-music-filter';
import type { AggregatedSong } from '../hooks/use-music-filter';
import type { MusicStream, MusicVideoCard } from '@/lib/data/types';

const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: 'stream', label: '配信で見る' },
  { key: 'song', label: '曲で見る' },
];

const SORT_OPTIONS: { value: SongSort; label: string }[] = [
  { value: 'count', label: '歌唱回数' },
  { value: 'recent', label: '最終歌唱日' },
  { value: 'name', label: 'あいうえお順' },
];

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
          <div className="flex items-center justify-between mb-md gap-md">
            <StateToggle
              options={VIEW_OPTIONS}
              activeKey={viewMode}
              onSelect={onSetViewMode}
            />
            {viewMode === 'song' && (
              <div className="flex items-center gap-xs">
                <label className="text-xs text-muted">並び替え</label>
                <select
                  value={songSort}
                  onChange={(e) => onSetSongSort(e.target.value as SongSort)}
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
          {viewMode === 'stream' ? (
            <StreamGrid
              streams={visibleUtawaku}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              externalSelectedId={pendingVideoId}
              onClearExternal={onClearPendingVideo}
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
