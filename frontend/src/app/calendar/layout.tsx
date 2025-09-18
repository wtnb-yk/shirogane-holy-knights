import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'カレンダー | だんいんポータル -白銀ノエル非公式ファンサイト-',
  description: '白銀ノエルさん関連のイベントやグッズ等のスケジュールを確認できます。カテゴリで絞り込んで、見逃したくない情報をチェックしましょう。',
  openGraph: {
    title: 'カレンダー | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさん関連のイベントやグッズ等のスケジュールを確認できます。カテゴリで絞り込んで、見逃したくない情報をチェックしましょう。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-home.png',
      width: 1200,
      height: 628,
      alt: 'カレンダー | だんいんポータル - 白銀ノエル非公式ファンサイト',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'カレンダー | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさん関連のイベントやグッズ等のスケジュールを確認できます。カテゴリで絞り込んで、見逃したくない情報をチェックしましょう。',
    images: 'https://www.noe-room.com/og-images/og-home.png',
  },
  alternates: {
    canonical: 'https://www.noe-room.com/calendar',
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

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}