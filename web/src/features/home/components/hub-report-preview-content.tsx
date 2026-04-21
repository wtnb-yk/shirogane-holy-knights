import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { GenreShare } from '@/features/report/lib/compute-stats';
import { HubCard } from './hub-card';
import { HubCardHeader } from './hub-card-header';
import { DonutChart } from './donut-chart';
import { StatCell } from './stat-cell';

type Props = {
  genres: GenreShare[];
  coverageRate: number;
  weeklyAverage: number;
  maxStreak: number;
  favoriteSongCount: number;
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
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20v-6" />
  </svg>
);

export function HubReportPreviewContent({
  genres,
  coverageRate,
  weeklyAverage,
  maxStreak,
  favoriteSongCount,
}: Props) {
  return (
    <HubCard>
      <HubCardHeader
        icon={ICON}
        iconBg="rgba(200,162,76,0.1)"
        label="Activity Report"
        title="団員レポート"
        className="mb-md"
      />

      <DonutChart genres={genres} />

      <div className="grid grid-cols-2 gap-sm mb-md">
        <StatCell value={`${coverageRate}`} unit="%" label="配信カバー率" />
        <StatCell
          value={`${weeklyAverage}`}
          unit="本/週"
          label="週あたり平均"
        />
        <StatCell value={`${maxStreak}`} unit="日" label="連続視聴記録" />
        <StatCell
          value={`${favoriteSongCount}`}
          unit="曲"
          label="お気に入り楽曲"
        />
      </div>

      <Link href="/report" className="mt-auto">
        <Button variant="secondary" className="w-full justify-center">
          レポートを作る
        </Button>
      </Link>
    </HubCard>
  );
}
