import type { MusicStream, MusicVideoCard } from '@/lib/data/types';
import { formatDate } from '@/lib/format';

type FeedItem = {
  type: 'utawaku' | 'live' | 'mv';
  videoId: string;
  title: string;
  thumbnailUrl: string;
  date: string;
  songCount?: number;
};

type Props = {
  utawakuStreams: MusicStream[];
  concertStreams: MusicStream[];
  mvCards: MusicVideoCard[];
  onSelect: (type: 'utawaku' | 'live' | 'mv', videoId: string) => void;
};

const TAG_STYLES: Record<string, string> = {
  utawaku: 'bg-[rgba(74,139,107,0.12)] text-success',
  live: 'bg-[rgba(200,162,76,0.14)] text-accent-label',
  mv: 'bg-[var(--glow-navy)] text-interactive',
};

const TAG_LABELS: Record<string, string> = {
  utawaku: '歌枠',
  live: 'ライブ',
  mv: 'MV',
};

function buildFeedItems(
  utawaku: MusicStream[],
  concerts: MusicStream[],
  mvCards: MusicVideoCard[],
): FeedItem[] {
  const items: FeedItem[] = [];

  for (const s of utawaku.slice(0, 4)) {
    items.push({
      type: 'utawaku',
      videoId: s.videoId,
      title: s.title,
      thumbnailUrl: s.thumbnailUrl,
      date: s.date,
      songCount: s.songs.length,
    });
  }
  for (const s of concerts.slice(0, 2)) {
    items.push({
      type: 'live',
      videoId: s.videoId,
      title: s.title,
      thumbnailUrl: s.thumbnailUrl,
      date: s.date,
      songCount: s.songs.length,
    });
  }
  for (const mv of mvCards.slice(0, 2)) {
    items.push({
      type: 'mv',
      videoId: mv.videoId,
      title: mv.songTitle,
      thumbnailUrl: mv.thumbnailUrl,
      date: mv.publishedAt,
    });
  }

  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export function LatestFeed({
  utawakuStreams,
  concertStreams,
  mvCards,
  onSelect,
}: Props) {
  const items = buildFeedItems(utawakuStreams, concertStreams, mvCards);
  if (items.length === 0) return null;

  // 無限ループ用に2セット
  const doubled = [...items, ...items];

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-lg pb-sm">
      <div className="font-mono text-xs font-normal tracking-wider text-accent-label uppercase mb-sm">
        Latest
      </div>
      <div className="overflow-hidden relative feed-track-wrap">
        <div className="flex gap-md w-max animate-feed-slide hover:[animation-play-state:paused]">
          {doubled.map((item, i) => (
            <FeedCard
              key={`${item.videoId}-${i}`}
              item={item}
              onClick={() => onSelect(item.type, item.videoId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedCard({ item, onClick }: { item: FeedItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[280px] md:w-[340px] cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ease-out-expo hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
    >
      <div className="w-full aspect-video relative overflow-hidden">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-hover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-sm left-sm">
          <span
            className={`inline-block px-1.5 font-mono text-3xs rounded-xs tracking-normal leading-[1.7] ${TAG_STYLES[item.type]}`}
          >
            {TAG_LABELS[item.type]}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-sm px-2.5">
          <div className="font-mono text-3xs text-white/70">
            {formatDate(item.date)}
          </div>
          <div className="text-xs font-semibold text-white leading-[1.35] line-clamp-2 mt-0.5">
            {item.title}
          </div>
          {item.songCount != null && (
            <div className="font-mono text-3xs text-white/60 mt-0.5">
              {item.songCount}曲
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
