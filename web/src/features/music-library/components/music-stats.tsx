import type { MusicStats } from '@/lib/data/types';

type Props = {
  stats: MusicStats;
};

export function MusicStatsDisplay({ stats }: Props) {
  return (
    <div className="flex items-center gap-sm flex-shrink-0">
      <Stat value={stats.songCount} unit="曲" />
      <Sep />
      <Stat label="歌枠" value={stats.utawakuCount} unit="回" />
      <Sep />
      <Stat label="MV" value={stats.mvCount} />
      <Sep />
      <Stat label="ライブ" value={stats.liveCount} />
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label?: string;
  value: number;
  unit?: string;
}) {
  return (
    <span className="font-mono text-2xs text-subtle tracking-normal">
      {label && <span>{label} </span>}
      <strong className="text-secondary font-medium">{value}</strong>
      {unit && <span>{unit}</span>}
    </span>
  );
}

function Sep() {
  return <span className="text-border text-3xs">·</span>;
}
