import Link from 'next/link';
import type { MusicStream } from '@/lib/data/types';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { HubCard } from './hub-card';
import { HubCardHeader } from './hub-card-header';

type Props = {
  stream: MusicStream;
};

const ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-accent-label)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export function HubSetlist({ stream }: Props) {
  return (
    <HubCard>
      <HubCardHeader
        icon={ICON}
        iconBg="rgba(200,162,76,0.1)"
        label="Latest Setlist"
        title="歌枠"
      />
      <div className="font-mono text-3xs text-subtle mb-md">
        {stream.title} &mdash; {formatDate(stream.date)}
      </div>

      <div className="flex-1 flex flex-col gap-0">
        {stream.songs.slice(0, 5).map((song, i) => (
          <div
            key={`${song.songId}-${i}`}
            className="flex items-center gap-sm px-sm py-xs rounded-sm transition-colors duration-150 hover:bg-surface-hover"
          >
            <span className="font-mono text-3xs text-subtle w-md text-right shrink-0">
              {i + 1}
            </span>
            <span className="text-xs font-medium text-heading flex-1 truncate">
              {song.title}
            </span>
            <span className="font-mono text-3xs text-subtle shrink-0 max-w-[var(--setlist-artist-max)] truncate text-right">
              {song.artist}
            </span>
          </div>
        ))}
      </div>

      <Link href="/music" className="mt-md">
        <Button variant="secondary" className="w-full justify-center">
          すべての楽曲を見る
        </Button>
      </Link>
    </HubCard>
  );
}
