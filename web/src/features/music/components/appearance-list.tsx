'use client';

import type { AggregatedSong } from '../hooks/use-music-filter';
import { formatDate, formatTime } from '@/lib/format';
import { useInlinePlay } from '../hooks/use-inline-play';
import { InlinePlayer } from './inline-player';
import { PlayToggleIcon } from './play-toggle-icon';

type Props = {
  song: AggregatedSong;
};

export function AppearanceList({ song }: Props) {
  const { toggle, isPlaying } = useInlinePlay();

  return (
    <div className="px-lg py-sm pb-md flex flex-col gap-2xs">
      {song.appearances
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((a, i) => {
          const key = `${a.videoId}-${i}`;
          const playing = isPlaying(key);

          return (
            <div key={key}>
              <div
                onClick={() => toggle(key)}
                className={`flex items-center gap-sm px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1 ${playing ? 'bg-[var(--glow-gold)]' : ''}`}
              >
                <span className="font-mono text-3xs text-subtle flex-shrink-0 w-16">
                  {formatDate(a.date)}
                </span>
                <span className="flex-1 min-w-0 truncate text-interactive">
                  {a.videoTitle}
                </span>
                {a.startSeconds > 0 && (
                  <span className="font-mono text-3xs text-subtle flex-shrink-0">
                    {formatTime(a.startSeconds)}
                  </span>
                )}
                <PlayToggleIcon isPlaying={playing} />
              </div>
              {playing && (
                <InlinePlayer
                  videoId={a.videoId}
                  startSeconds={a.startSeconds}
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
