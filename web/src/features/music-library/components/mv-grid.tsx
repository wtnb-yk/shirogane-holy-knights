import type { MusicVideoCard } from '@/lib/data/types';

type Props = {
  cards: MusicVideoCard[];
};

const TYPE_LABELS: Record<string, string> = {
  オリジナル: 'オリジナル',
  カバー: 'カバー',
};

export function MvGrid({ cards }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
      {cards.map((card) => (
        <MvCard key={card.videoId} card={card} />
      ))}
    </div>
  );
}

function MvCard({ card }: { card: MusicVideoCard }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${card.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-surface border border-border rounded-md overflow-hidden transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
    >
      <div className="relative w-full aspect-video overflow-hidden">
        {card.thumbnailUrl ? (
          <img
            src={card.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-hover" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 ease-out-expo hover:opacity-100 group-hover:opacity-100 [.group:hover_&]:opacity-100">
          <div className="w-11 h-11 rounded-full bg-white/92 backdrop-blur-[4px] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out-expo hover:scale-[1.08]">
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
            <span
              className={`inline-block px-1.5 font-mono text-3xs rounded-xs tracking-normal leading-[1.7] bg-[var(--glow-navy)] text-interactive`}
            >
              {TYPE_LABELS[card.type] ?? card.type}
            </span>
            <span className="text-xs text-muted truncate">{card.artist}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
