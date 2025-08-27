import { PerformedSong } from '../types/types';
import { PerformedSongCard } from './PerformedSongCard';
import { SkeletonSongCard } from './SkeletonSongCard';
import { BaseGrid } from '@/components/common/BaseGrid';

interface PerformedSongsGridProps {
  songs: PerformedSong[];
  loading?: boolean;
  error?: string | null;
  onSongClick: (song: PerformedSong) => void;
}

export function PerformedSongsGrid({ songs, loading = false, error, onSongClick }: PerformedSongsGridProps) {
  return (
    <BaseGrid
      items={songs}
      loading={loading}
      error={error || null}
      renderItem={(song, index) => (
        <PerformedSongCard 
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
      skeletonCount={12}
    />
  );
}