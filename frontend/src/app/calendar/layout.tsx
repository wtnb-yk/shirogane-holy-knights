import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CALENDAR - だんいんポータル',
  description: '白銀ノエルさん関連のイベントやグッズ等のスケジュールを確認できます。イベントタイプやキーワードで絞り込んで、見逃したくない情報をチェックしましょう。',
  openGraph: {
    title: 'CALENDAR - だんいんポータル',
    description: '白銀ノエルさん関連のイベントやグッズ等のスケジュールを確認できます。イベントタイプやキーワードで絞り込んで、見逃したくない情報をチェックしましょう。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-home.png',
      width: 1200,
      height: 628,
      alt: 'CALENDAR - 白銀ノエルさんカレンダー',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CALENDAR - だんいんポータル',
    description: '白銀ノエルさん関連のイベントとグッズ等のスケジュールを確認できます。',
    images: 'https://www.noe-room.com/og-images/og-home.png',
  },
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
