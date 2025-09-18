import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '楽曲 | だんいんポータル -白銀ノエル非公式ファンサイト-',
  description: '白銀ノエルさんが歌枠や記念ライブで歌った曲を検索・閲覧できます。楽曲名・アーティスト名での検索、歌唱回数や最新歌唱日での並び替えが可能です。',
  openGraph: {
    title: '楽曲 | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさんが歌枠や記念ライブで歌った曲を検索・閲覧できます。楽曲名・アーティスト名での検索、歌唱回数や最新歌唱日での並び替えが可能です。',
    type: 'website',
    locale: 'ja_JP',
    images: [{
      url: 'https://www.noe-room.com/og-images/og-home.png',
      width: 1200,
      height: 628,
      alt: '楽曲 | だんいんポータル - 白銀ノエル非公式ファンサイト',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '楽曲 | だんいんポータル -白銀ノエル非公式ファンサイト-',
    description: '白銀ノエルさんが歌枠や記念ライブで歌った曲を検索・閲覧できます。楽曲名・アーティスト名での検索、歌唱回数や最新歌唱日での並び替えが可能です。',
    images: 'https://www.noe-room.com/og-images/og-home.png',
  },
  alternates: {
    canonical: 'https://www.noe-room.com/songs',
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

export default function SongsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}