import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  getSongs,
  getUtawakuStreams,
  getConcertStreams,
  getMusicVideoCards,
  getMusicStats,
} from '@/lib/data/music';
import { MusicPage } from '@/features/music/components/music-page';

export const metadata: Metadata = {
  title: '楽曲',
  description:
    '歌枠・ライブ・MVを横断検索。白銀ノエルの全楽曲レパートリーを収録。',
};

export default function Page() {
  const songs = getSongs();
  const utawakuStreams = getUtawakuStreams();
  const concertStreams = getConcertStreams();
  const mvCards = getMusicVideoCards();
  const stats = getMusicStats();

  return (
    <Suspense>
      <MusicPage
        songs={songs}
        utawakuStreams={utawakuStreams}
        concertStreams={concertStreams}
        mvCards={mvCards}
        stats={stats}
      />
    </Suspense>
  );
}
