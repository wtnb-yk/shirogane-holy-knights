import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'スペシャル | 白銀ノエル非公式ファンサイト',
  description: '白銀ノエルさんの誕生日や記念日などの特別なイベントやキャンペーンを確認できます。開催中のイベントや今後予定されているスペシャル企画をチェックしましょう。',
  openGraph: {
    title: 'スペシャル | 白銀ノエル非公式ファンサイト',
    description: '白銀ノエルさんの誕生日や記念日などの特別なイベントやキャンペーンを確認できます。',
    url: 'https://www.noe-room.com/specials',
    siteName: '白銀ノエル非公式ファンサイト',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'スペシャル | 白銀ノエル非公式ファンサイト',
    description: '白銀ノエルさんの誕生日や記念日などの特別なイベントやキャンペーンを確認できます。',
  },
};

export default function SpecialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}