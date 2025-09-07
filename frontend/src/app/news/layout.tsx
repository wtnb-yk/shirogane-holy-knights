import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEWS - だんいんポータル',
  description: '白銀ノエルさん関連のニュースや話題をまとめています。カテゴリやキーワードで検索して最新情報をチェックできます。',
  openGraph: {
    title: 'NEWS - だんいんポータル',
    description: '白銀ノエルさん関連のニュースや話題をまとめています。カテゴリやキーワードで検索して最新情報をチェックできます。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'NEWS - だんいんポータル',
    description: '白銀ノエルさん関連のニュースや話題をまとめています。',
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}