'use client';

import { useRef, useState } from 'react';
import type { Stream } from '@/lib/data/types';
import { PageHeader } from '@/components/ui/page-header';
import { useReportStats } from '../hooks/use-report-stats';
import { ReportCard, type ReportTheme } from './report-card';
import { ReportActions } from './report-actions';
import { ReportEmpty } from './report-empty';

type Props = {
  streams: Stream[];
};

export function ReportPage({ streams }: Props) {
  const stats = useReportStats(streams);
  const [theme, setTheme] = useState<ReportTheme>('light');
  const cardRef = useRef<HTMLDivElement>(null);
  const isEmpty = stats.streamCount === 0;

  return (
    <>
      <PageHeader
        title="団員レポート"
        description="あなたの視聴記録から、報告書を生成します。"
      />

      <div
        className="flex flex-col items-center px-lg max-md:px-md py-xl min-h-[60vh]"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(200,162,76,0.04) 0%, transparent 100%)',
        }}
      >
        {isEmpty ? (
          <ReportEmpty theme={theme} />
        ) : (
          <>
            <ReportCard ref={cardRef} stats={stats} theme={theme} />
            <ReportActions
              stats={stats}
              theme={theme}
              onThemeChange={setTheme}
              cardRef={cardRef}
            />
          </>
        )}
      </div>
    </>
  );
}
