import Link from 'next/link';
import type { Song } from '@/lib/data/types';

type Props = {
  songs: Song[];
};

export function SidebarMusic({ songs }: Props) {
  const topSongs = [...songs]
    .sort((a, b) => b.streamPerformances.length - a.streamPerformances.length)
    .slice(0, 3);

  return (
    <div className="bg-surface border border-border rounded-lg p-lg transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card">
      <div className="font-mono text-3xs tracking-wide text-accent-label uppercase mb-sm">
        Music
      </div>
      <div className="font-display text-base font-semibold text-heading mb-sm">
        楽曲
      </div>

      <div className="flex flex-col gap-0.5">
        {topSongs.map((song, i) => (
          <div
            key={song.id}
            className="flex items-center gap-sm px-sm py-xs rounded-xs transition-colors duration-150 hover:bg-[var(--glow-navy)]"
          >
            <span className="font-mono text-3xs text-subtle w-[16px] text-right">
              {i + 1}
            </span>
            <span className="text-xs font-medium text-heading flex-1 truncate">
              {song.title}
            </span>
            <span className="font-mono text-3xs text-subtle">
              {song.streamPerformances.length}回
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/music"
        className="inline-flex items-center gap-xs mt-md text-xs text-muted transition-colors duration-200 hover:text-foreground"
      >
        {songs.length.toLocaleString()}曲すべて見る &rarr;
      </Link>
    </div>
  );
}
