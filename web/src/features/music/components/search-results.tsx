import type { Song } from '@/lib/data/types';
import { PlayableSearchItem } from './playable-search-item';

type Props = {
  query: string;
  results: Song[];
};

/** 横断検索結果のレイアウト */
export function SearchResults({ query, results }: Props) {
  if (results.length === 0) {
    return (
      <div className="text-center py-2xl text-muted text-sm">
        「{query}」に該当する楽曲が見つかりません
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {results.map((song) => (
        <PlayableSearchItem key={song.id} song={song} />
      ))}
    </div>
  );
}
