import type { Metadata } from 'next';
import { AboutPage } from '@/features/about/components/about-page';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description:
    'だんいんログは白銀ノエルファン（団員）のための非公式推し活記録アプリです。',
};

export default function Page() {
  return <AboutPage />;
}
