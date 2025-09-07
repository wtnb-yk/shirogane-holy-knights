import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ARCHIVE - だんいんポータル',
  description: '配信アーカイブの検索、カテゴリーや日付での絞り込みができます。最新の配信はYouTubeチャンネルをご確認ください。',
  openGraph: {
    title: 'ARCHIVE - だんいんポータル',
    description: '配信アーカイブの検索、カテゴリーや日付での絞り込みができます。最新の配信はYouTubeチャンネルをご確認ください。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'ARCHIVE - だんいんポータル',
    description: '白銀ノエルさんの配信アーカイブを検索・閲覧できます。',
  },
};

export default function ArchivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}