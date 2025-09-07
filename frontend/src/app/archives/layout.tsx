import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ARCHIVE - だんいんポータル',
  description: '配信アーカイブの検索、カテゴリーや日付での絞り込みができます。最新の配信はYouTubeチャンネルをご確認ください。',
  openGraph: {
    title: 'ARCHIVE - だんいんポータル',
    description: '配信アーカイブの検索、カテゴリーや日付での絞り込みができます。最新の配信はYouTubeチャンネルをご確認ください。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-archives.svg',
      width: 1200,
      height: 630,
      alt: 'ARCHIVE - 白銀ノエル配信アーカイブ',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARCHIVE - だんいんポータル',
    description: '配信アーカイブの検索、カテゴリーや日付での絞り込みができます。',
    images: 'https://www.noe-room.com/og-images/og-archives.svg',
  },
};

export default function ArchivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
