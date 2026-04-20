import type { MusicVideoCard } from '@/lib/data/types';
import { PlayableMvCard } from './playable-mv-card';

type Props = {
  cards: MusicVideoCard[];
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
};

/** MVカードのグリッドレイアウト */
export function MvGrid({ cards, favoriteIds, onToggleFavorite }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
      {cards.map((card) => (
        <PlayableMvCard
          key={card.videoId}
          card={card}
          isFav={favoriteIds.has(card.songId)}
          onToggleFav={() => onToggleFavorite(card.songId)}
        />
      ))}
    </div>
  );
}
