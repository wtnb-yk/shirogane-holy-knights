import type { Metadata } from 'next';
import { getStreams } from '@/lib/data/streams';
import { FootprintPage } from '@/features/footprint/components/footprint-page';

export const metadata: Metadata = {
  title: '団員のあしあと',
  description: 'あなたの視聴履歴をヒートマップで可視化',
  openGraph: {
    images: [{ url: '/api/og/footprint', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og/footprint'],
  },
};

export default function Page() {
  const streams = getStreams();
  return <FootprintPage streams={streams} />;
}
