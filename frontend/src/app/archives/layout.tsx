import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'アーカイブ | だんいんポータル -白銀ノエル非公式ファンサイト-',
  description: '白銀ノエルさんの配信アーカイブの検索、カテゴリーや日付での絞り込みができます。最新の配信はYouTubeチャンネルをご確認ください。',
  openGraph: {
    title: 'アーカイブ | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさんの配信アーカイブの検索、カテゴリーや日付での絞り込みができます。最新の配信はYouTubeチャンネルをご確認ください。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-home.png',
      width: 1200,
      height: 628,
      alt: 'アーカイブ | だんいんポータル - 白銀ノエル非公式ファンサイト',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'アーカイブ | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさんの配信アーカイブの検索、カテゴリーや日付での絞り込みができます。最新の配信はYouTubeチャンネルをご確認ください。',
    images: 'https://www.noe-room.com/og-images/og-home.png',
  },
  alternates: {
    canonical: 'https://www.noe-room.com/archives',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ArchivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}