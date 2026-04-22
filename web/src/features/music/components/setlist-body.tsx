'use client';

import type { MusicStreamSong } from '@/lib/data/types';
import { formatTime } from '@/lib/format';
import { useInlinePlay } from '../hooks/use-inline-play';
import { FavButton } from './fav-button';
import { InlinePlayer } from './inline-player';
import { PlayToggleIcon } from './play-toggle-icon';

type Props = {
  videoId: string;
  songs: MusicStreamSong[];
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
  /** URL遷移時の自動再生開始秒数 */
  autoPlayStartSeconds?: number | null;
};

export function SetlistBody({
  videoId,
  songs,
  favoriteIds,
  onToggleFavorite,
  autoPlayStartSeconds,
}: Props) {
  const initialKey =
    autoPlayStartSeconds != null
      ? (() => {
          const idx = songs.findIndex(
            (s) => s.startSeconds === autoPlayStartSeconds,
          );
          return idx >= 0 ? `${songs[idx].songId}-${idx}` : null;
        })()
      : null;

  const { toggle, isPlaying } = useInlinePlay(initialKey);

  return (
    <div className="flex flex-col gap-0.5">
      {songs.map((song, i) => {
        const key = `${song.songId}-${i}`;
        const playing = isPlaying(key);
        const timeStr = formatTime(song.startSeconds);

        return (
          <div key={key}>
            <div
              onClick={() => toggle(key)}
              className={`flex items-center gap-sm px-2.5 py-[7px] text-xs rounded-sm cursor-pointer transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1 ${playing ? 'bg-[var(--glow-gold)]' : ''}`}
            >
              <span className="font-mono text-3xs text-subtle w-5 text-right flex-shrink-0">
                {i + 1}
              </span>
              <FavButton
                active={favoriteIds.has(song.songId)}
                onClick={() => onToggleFavorite(song.songId)}
              />
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
              <PlayToggleIcon isPlaying={playing} />
            </div>
            {playing && (
              <InlinePlayer
                videoId={videoId}
                startSeconds={song.startSeconds}
                songTitle={song.title}
                artist={song.artist}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
