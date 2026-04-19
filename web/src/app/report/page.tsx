import type { Metadata } from 'next';
import { getStreams } from '@/lib/data/streams';
import { ReportPage } from '@/features/report/components/report-page';

export const metadata: Metadata = {
  title: '団員レポート',
  description: 'あなたの視聴記録から、報告書を生成します。',
};

export default function Page() {
  const streams = getStreams();
  return <ReportPage streams={streams} />;
}
