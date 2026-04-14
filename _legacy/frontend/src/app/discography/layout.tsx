import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ディスコグラフィー | だんいんポータル -白銀ノエル非公式ファンサイト-',
  description: '白銀ノエルさんの配信楽曲や歌ってみたを検索・閲覧できます。楽曲名での検索や配信日での並び替え、カテゴリでの絞り込みができます。',
  openGraph: {
    title: 'ディスコグラフィー | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさんの配信楽曲や歌ってみたを検索・閲覧できます。楽曲名での検索や配信日での並び替え、カテゴリでの絞り込みができます。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-home.png',
      width: 1200,
      height: 628,
      alt: 'ディスコグラフィー | だんいんポータル - 白銀ノエル非公式ファンサイト',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ディスコグラフィー | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさんの配信楽曲や歌ってみたを検索・閲覧できます。楽曲名での検索や配信日での並び替え、カテゴリでの絞り込みができます。',
    images: 'https://www.noe-room.com/og-images/og-home.png',
  },
  alternates: {
    canonical: 'https://www.noe-room.com/discography',
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

export default function DiscographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
