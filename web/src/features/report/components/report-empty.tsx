import { Button } from '@/components/ui/button';
import { ReportCard, type ReportTheme } from './report-card';
import { EMPTY_STATS } from '../lib/compute-stats';

type Props = {
  theme: ReportTheme;
};

export function ReportEmpty({ theme }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-md animate-card-entrance-delayed">
        <p className="text-sm text-secondary leading-[1.8] mb-md">
          配信でチェックすると、
          <br />
          あなただけの報告書が生成されます。
        </p>
        <a href="/streams">
          <Button variant="cta">配信を開く</Button>
        </a>
      </div>

      <div className="opacity-25 blur-[1px] pointer-events-none">
        <ReportCard stats={EMPTY_STATS} theme={theme} />
      </div>
    </div>
  );
}
