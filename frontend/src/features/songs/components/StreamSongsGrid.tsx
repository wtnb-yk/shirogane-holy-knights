import { StreamSong, ViewMode } from '../types/types';
import { StreamSongCard } from './StreamSongCard';
import { StreamSongListCard } from './StreamSongListCard';
import { SkeletonSongCard } from './SkeletonSongCard';
import { BaseGrid } from '@/components/common/BaseGrid';

interface StreamSongsGridProps {
  songs: StreamSong[];
  loading?: boolean;
  error?: string | null;
  viewMode?: ViewMode;
  onSongClick: (song: StreamSong) => void;
  onSongPlayClick?: (song: StreamSong) => void;
}

export function StreamSongsGrid({ songs, loading = false, error, viewMode = ViewMode.GRID, onSongClick, onSongPlayClick }: StreamSongsGridProps) {
  const getGridClassName = () => {
    if (viewMode === ViewMode.LIST) {
      return 'grid-cols-1 gap-3';
    }
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0.5';
  };

  return (
    <BaseGrid
      items={songs}
      loading={loading}
      error={error || null}
      gridClassName={getGridClassName()}
      renderItem={(song, index) => {
        if (viewMode === ViewMode.LIST) {
          return (
            <StreamSongListCard
              key={song.id} 
              song={song}
              index={index}
              onClick={onSongClick}
            />
          );
        }
        return (
          <StreamSongCard
            key={song.id} 
            song={song}
            index={index}
            onClick={onSongClick}
            onPlayClick={onSongPlayClick}
          />
        );
      }}
      renderSkeleton={(index) => <SkeletonSongCard key={index} />}
      emptyMessage={{
        title: '楽曲が見つかりませんでした',
        subtitle: '検索条件を変更してお試しください'
      }}
      skeletonCount={viewMode === ViewMode.LIST ? 6 : 12}
    />
  );
}
