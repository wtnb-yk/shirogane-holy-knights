import Link from 'next/link';
import type { MusicStream } from '@/lib/data/types';
import { formatDate } from '@/lib/format';

type Props = {
  stream: MusicStream;
};

export function HubSetlist({ stream }: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg p-lg flex flex-col transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card">
      <div className="font-mono text-3xs tracking-wider text-accent-label uppercase mb-xs">
        Latest Setlist
      </div>
      <h2 className="font-display text-base font-semibold text-heading mb-2xs">
        歌枠
      </h2>
      <div className="font-mono text-3xs text-subtle mb-md">
        {stream.title} &mdash; {formatDate(stream.date)}
      </div>

      <div className="flex-1 flex flex-col gap-0">
        {stream.songs.map((song, i) => (
          <div
            key={`${song.songId}-${i}`}
            className="flex items-center gap-sm px-sm py-xs rounded-sm transition-colors duration-150 hover:bg-surface-hover"
          >
            <span className="font-mono text-3xs text-subtle w-md text-right flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-xs font-medium text-heading flex-1 truncate">
              {song.title}
            </span>
            <span className="font-mono text-3xs text-subtle flex-shrink-0 max-w-[120px] truncate text-right">
              {song.artist}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/music"
        className="mt-md text-xs text-muted transition-colors duration-200 hover:text-foreground"
      >
        すべての楽曲を見る &rarr;
      </Link>
    </div>
  );
}
