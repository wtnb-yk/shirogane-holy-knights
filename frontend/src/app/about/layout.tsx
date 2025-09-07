import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ABOUT - だんいんポータル',
  description: '「だんいんポータル」は、ホロライブプロダクション所属VTuber 白銀ノエルさんを応援する非公式ファンサイトです。サイト概要、免責事項、運営情報を掲載しています。',
  openGraph: {
    title: 'ABOUT - だんいんポータル',
    description: '「だんいんポータル」は、ホロライブプロダクション所属VTuber 白銀ノエルさんを応援する非公式ファンサイトです。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'ABOUT - だんいんポータル',
    description: '白銀ノエルさんの非公式応援サイトについて',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}