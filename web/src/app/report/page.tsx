import type { Metadata } from 'next';
import { getStreams } from '@/lib/data/streams';
import { ReportPage } from '@/features/report/components/report-page';

export const metadata: Metadata = {
  title: '団員レポート',
  description: 'あなたの視聴記録から、報告書を生成します。',
  openGraph: {
    images: [{ url: '/api/og/report', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og/report'],
  },
};

export default function Page() {
  const streams = getStreams();
  return <ReportPage streams={streams} />;
}
