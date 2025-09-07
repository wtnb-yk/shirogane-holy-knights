import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEWS - だんいんポータル',
  description: '白銀ノエルさん関連のニュースや話題をまとめています。カテゴリやキーワードで検索して最新情報をチェックできます。',
  openGraph: {
    title: 'NEWS - だんいんポータル',
    description: '白銀ノエルさん関連のニュースや話題をまとめています。カテゴリやキーワードで検索して最新情報をチェックできます。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: '/og-images/og-news.svg',
      width: 1200,
      height: 630,
      alt: 'NEWS - 白銀ノエル関連ニュース',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEWS - だんいんポータル',
    description: '白銀ノエルさん関連のニュースや話題をまとめています。',
    images: '/og-images/og-news.svg',
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}