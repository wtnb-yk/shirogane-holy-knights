import type { MusicStreamSong } from '@/lib/data/types';
import { FavButton } from './fav-button';

type Props = {
  title: string;
  date: string;
  songs: MusicStreamSong[];
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
  onClose: () => void;
};

function formatTime(seconds: number): string {
  if (seconds <= 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

export function StreamDetail({
  title,
  date,
  songs,
  favoriteIds,
  onToggleFavorite,
  onClose,
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
      <div className="flex flex-col gap-0.5">
        {songs.map((song, i) => (
          <SetlistRow
            key={`${song.songId}-${i}`}
            index={i + 1}
            song={song}
            isFav={favoriteIds.has(song.songId)}
            onToggleFav={() => onToggleFavorite(song.songId)}
          />
        ))}
      </div>
    </div>
  );
}

function SetlistRow({
  index,
  song,
  isFav,
  onToggleFav,
}: {
  index: number;
  song: MusicStreamSong;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const timeStr = formatTime(song.startSeconds);

  return (
    <div className="flex items-center gap-sm px-2.5 py-[7px] text-xs rounded-sm cursor-pointer transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1">
      <span className="font-mono text-3xs text-subtle w-5 text-right flex-shrink-0">
        {index}
      </span>
      <FavButton active={isFav} onClick={onToggleFav} />
      <span className="text-heading font-medium flex-1 min-w-0 truncate">
        {song.title}
      </span>
      <span className="text-xs text-muted flex-shrink-0 max-w-[140px] truncate">
        {song.artist}
      </span>
      {timeStr && (
        <span className="font-mono text-3xs text-subtle flex-shrink-0">
          {timeStr}
        </span>
      )}
    </div>
  );
}
