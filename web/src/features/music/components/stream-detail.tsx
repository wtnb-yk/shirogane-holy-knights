import type { MusicStreamSong } from '@/lib/data/types';
import { formatDate } from '@/lib/format';
import { SetlistBody } from './setlist-body';

type Props = {
  videoId: string;
  title: string;
  date: string;
  songs: MusicStreamSong[];
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
  onClose: () => void;
  /** URL遷移時の自動再生開始秒数 */
  autoPlayStartSeconds?: number | null;
};

export function StreamDetail({
  videoId,
  title,
  date,
  songs,
  favoriteIds,
  onToggleFavorite,
  onClose,
  autoPlayStartSeconds,
}: Props) {
  return (
    <div className="col-span-full bg-surface border border-accent rounded-lg p-lg animate-fade-in">
      <div className="flex items-center justify-between mb-md">
        <div>
          <div className="font-display text-lg font-semibold text-heading">
            {title}
          </div>
          <div className="font-mono text-2xs text-subtle">
            {formatDate(date)} · {songs.length}曲
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-surface-hover flex items-center justify-center text-muted hover:bg-border hover:text-heading cursor-pointer transition-all duration-250 ease-out-expo"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>
      <SetlistBody
        videoId={videoId}
        songs={songs}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
        autoPlayStartSeconds={autoPlayStartSeconds}
      />
    </div>
  );
}
