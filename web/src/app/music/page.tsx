import {
  getSongs,
  getUtawakuStreams,
  getConcertStreams,
  getMusicVideoCards,
  getMusicStats,
} from '@/lib/data/music';
import { MusicPage } from '@/features/music-library/components/music-page';

export default function Page() {
  const songs = getSongs();
  const utawakuStreams = getUtawakuStreams();
  const concertStreams = getConcertStreams();
  const mvCards = getMusicVideoCards();
  const stats = getMusicStats();

  return (
    <MusicPage
      songs={songs}
      utawakuStreams={utawakuStreams}
      concertStreams={concertStreams}
      mvCards={mvCards}
      stats={stats}
    />
  );
}
