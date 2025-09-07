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
      url: 'https://www.noe-room.com/og-images/og-news.png',
      width: 1200,
      height: 628,
      alt: 'NEWS - 白銀ノエル関連ニュース',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEWS - だんいんポータル',
    description: '白銀ノエルさん関連のニュースや話題をまとめています。',
    images: 'https://www.noe-room.com/og-images/og-news.png',
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}