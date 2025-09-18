import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ニュース | だんいんポータル -白銀ノエル非公式ファンサイト-',
  description: '白銀ノエルさん関連のニュースや話題をまとめています。カテゴリやキーワードで検索して最新情報をチェックできます。',
  openGraph: {
    title: 'ニュース | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさん関連のニュースや話題をまとめています。カテゴリやキーワードで検索して最新情報をチェックできます。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-home.png',
      width: 1200,
      height: 628,
      alt: 'ニュース | だんいんポータル - 白銀ノエル非公式ファンサイト',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ニュース | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさん関連のニュースや話題をまとめています。カテゴリやキーワードで検索して最新情報をチェックできます。',
    images: 'https://www.noe-room.com/og-images/og-home.png',
  },
  alternates: {
    canonical: 'https://www.noe-room.com/news',
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

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}