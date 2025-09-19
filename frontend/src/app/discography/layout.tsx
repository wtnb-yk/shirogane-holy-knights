import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ディスコグラフィー | だんいんポータル -白銀ノエル非公式ファンサイト-',
  description: '白銀聖騎士団の音楽リリースをまとめています。アルバムタイプやキーワードで検索して楽曲をチェックできます。',
  openGraph: {
    title: 'ディスコグラフィー | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀聖騎士団の音楽リリースをまとめています。アルバムタイプやキーワードで検索して楽曲をチェックできます。',
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
    description: '白銀聖騎士団の音楽リリースをまとめています。アルバムタイプやキーワードで検索して楽曲をチェックできます。',
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