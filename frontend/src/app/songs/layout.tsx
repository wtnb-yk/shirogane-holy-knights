import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SONG - だんいんポータル',
  description: '白銀ノエルさんが歌枠や記念ライブで歌った曲を検索・閲覧できます。楽曲名・アーティスト名での検索、歌唱回数や最新歌唱日での並び替えが可能です。',
  openGraph: {
    title: 'SONG - だんいんポータル',
    description: '白銀ノエルさんが歌枠や記念ライブで歌った曲を検索・閲覧できます。楽曲名・アーティスト名での検索、歌唱回数や最新歌唱日での並び替えが可能です。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'SONG - だんいんポータル',
    description: '白銀ノエルさんの楽曲を検索・閲覧できます。',
  },
};

export default function SongsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}