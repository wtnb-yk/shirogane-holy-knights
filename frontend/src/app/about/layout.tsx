import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ABOUT - だんいんポータル',
  description: 'だんいんポータルは、白銀ノエルさんを応援する非公式ファンサイトです。サイトの概要や免責事項、運営情報をご確認いただけます。',
  openGraph: {
    title: 'ABOUT - だんいんポータル',
    description: 'だんいんポータルは、白銀ノエルさんを応援する非公式ファンサイトです。サイトの概要や免責事項、運営情報をご確認いただけます。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-about.png',
      width: 1200,
      height: 628,
      alt: 'ABOUT - だんいんポータルについて',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABOUT - だんいんポータル',
    description: 'だんいんポータルは、白銀ノエルさんを応援する非公式ファンサイトです。',
    images: 'https://www.noe-room.com/og-images/og-about.png',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
