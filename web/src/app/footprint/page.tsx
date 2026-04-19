import type { Metadata } from 'next';
import { FootprintPage } from '@/features/footprint/components/footprint-page';

export const metadata: Metadata = {
  title: '団員のあしあと',
  description: 'あなたの視聴履歴をヒートマップで可視化',
};

export default function Page() {
  return <FootprintPage />;
}
