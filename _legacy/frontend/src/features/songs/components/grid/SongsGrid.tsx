import { useMemo, useCallback } from 'react';
import { StreamSong } from '@/features/songs/types/types';
import { SongCard } from '@/features/songs/components/grid/cards/SongCard';
import { SkeletonSongCard } from '@/features/songs/components/grid/cards/SkeletonSongCard';
import { BaseGrid } from '@/components/Layout/BaseGrid';
import { getSongGridColumns, DEFAULT_EMPTY_MESSAGE, DEFAULT_SKELETON_COUNT } from '../../config/gridConfig';
import { generateGridClassName } from '@/features/archives/utils/gridLayoutCalculator';

interface SongsGridProps {
  songs: StreamSong[];
  loading?: boolean;
  error?: string | null;
  onSongClick: (song: StreamSong) => void;
}

export function SongsGrid({ songs, loading = false, error, onSongClick }: SongsGridProps) {
  const gridConfig = useMemo(() => {
    const gridColumns = getSongGridColumns();
    const gridClassName = generateGridClassName(gridColumns);
    return {
      columns: gridColumns,
      className: gridClassName.replace('grid ', '')
    };
  }, []);

  const renderItem = useCallback((song: StreamSong, index: number) => (
    <SongCard
      key={song.id}
      song={song}
      index={index}
      onClick={onSongClick}
    />
  ), [onSongClick]);

  const renderSkeleton = useCallback((index: number) => (
    <SkeletonSongCard key={index} />
  ), []);

  const emptyMessage = useMemo(() => DEFAULT_EMPTY_MESSAGE, []);

  return (
    <BaseGrid
      items={songs}
      loading={loading}
      error={error || null}
      gridClassName={gridConfig.className}
      renderItem={renderItem}
      renderSkeleton={renderSkeleton}
      emptyMessage={emptyMessage}
      skeletonCount={DEFAULT_SKELETON_COUNT}
    />
  );
}
