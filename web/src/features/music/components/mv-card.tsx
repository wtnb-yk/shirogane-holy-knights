'use client';

import type { MusicVideoCard } from '@/lib/data/types';
import { FavButton } from './fav-button';

const TYPE_LABELS: Record<string, string> = {
  オリジナル: 'オリジナル',
  カバー: 'カバー',
};

type Props = {
  card: MusicVideoCard;
  isFav: boolean;
  onToggleFav: () => void;
};

/** MVカード — サムネクリックでYouTubeに遷移 */
export function MvCard({ card, isFav, onToggleFav }: Props) {
  return (
    <div>
      <a
        href={`https://www.youtube.com/watch?v=${card.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-surface border rounded-md overflow-hidden cursor-pointer transition-all duration-300 ease-out-expo border-border hover:border-border-hover hover:shadow-card-hover hover:-translate-y-0.5 block"
      >
        <div className="relative w-full aspect-video overflow-hidden">
          {card.thumbnailUrl ? (
            <img
              src={card.thumbnailUrl}
              alt={card.songTitle}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-surface-hover" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 ease-out-expo group-hover:opacity-100">
            <div className="w-11 h-11 rounded-full bg-white/92 backdrop-blur-xs flex items-center justify-center shadow-card-hover transition-transform duration-300 ease-out-expo group-hover:scale-[1.08]">
              <svg
                className="w-4 h-4 text-interactive ml-0.5"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M3 1.5l7.5 4.5-7.5 4.5z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="px-3 py-2.5 pb-3 flex items-start gap-sm">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-heading truncate">
              {card.songTitle}
            </div>
            <div className="flex items-center gap-1.5 mt-2xs">
              <span className="inline-block px-1.5 font-mono text-3xs rounded-xs tracking-normal leading-[1.7] bg-[var(--glow-navy)] text-interactive">
                {TYPE_LABELS[card.type] ?? card.type}
              </span>
              <span className="text-xs text-muted truncate">{card.artist}</span>
            </div>
          </div>
          <FavButton active={isFav} onClick={onToggleFav} size="sm" />
        </div>
      </a>
    </div>
  );
}
