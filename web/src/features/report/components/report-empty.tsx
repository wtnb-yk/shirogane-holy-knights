import { Button } from '@/components/ui/button';
import { ReportCard, type ReportTheme } from './report-card';
import type { ReportStats } from '../lib/compute-stats';

const EMPTY_STATS: ReportStats = {
  streamCount: 0,
  daysSinceFirst: 0,
  totalHours: 0,
  topGenre: null,
  maxStreak: 0,
  lastWatchedDate: '',
  favoriteSeries: null,
};

type Props = {
  theme: ReportTheme;
};

export function ReportEmpty({ theme }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="opacity-25 blur-[1px] pointer-events-none">
        <ReportCard stats={EMPTY_STATS} theme={theme} />
      </div>

      <div className="text-center mt-xl animate-card-entrance-delayed">
        <p className="text-sm text-secondary leading-[1.8] mb-md">
          配信一覧でチェックすると、
          <br />
          あなただけの報告書が生成されます。
        </p>
        <a href="/streams">
          <Button variant="cta">配信一覧を開く</Button>
        </a>
      </div>
    </div>
  );
}
