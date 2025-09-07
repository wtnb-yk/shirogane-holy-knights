import { StreamSong } from '../types/types';
import { StreamSongListCard } from './StreamSongListCard';
import { SkeletonSongCard } from './SkeletonSongCard';
import { BaseGrid } from '@/components/common/BaseGrid';

interface StreamSongsListProps {
  songs: StreamSong[];
  loading?: boolean;
  error?: string | null;
  onSongClick: (song: StreamSong) => void;
}

export function StreamSongsList({ songs, loading = false, error, onSongClick }: StreamSongsListProps) {
  return (
    <BaseGrid
      items={songs}
      loading={loading}
      error={error || null}
      gridClassName="grid-cols-1 gap-1 sm:gap-4"
      renderItem={(song, index) => (
        <StreamSongListCard
          key={song.id} 
          song={song}
          index={index}
          onClick={onSongClick}
        />
      )}
      renderSkeleton={(index) => <SkeletonSongCard key={index} />}
      emptyMessage={{
        title: '楽曲が見つかりませんでした',
        subtitle: '検索条件を変更してお試しください'
      }}
      skeletonCount={6}
    />
  );
}
