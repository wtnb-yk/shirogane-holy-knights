import type { MusicStream } from '@/lib/data/types';
import { formatDate } from '@/lib/format';

type Props = {
  stream: MusicStream;
  isSelected: boolean;
  onClick: () => void;
};

/** 楽曲配信カード（サムネ + 日付 + タイトル + 曲数） */
export function MusicStreamCard({ stream, isSelected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border rounded-md overflow-hidden cursor-pointer transition-all duration-300 ease-out-expo ${
        isSelected
          ? 'border-accent shadow-card-active'
          : 'border-border hover:border-border-hover hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
      }`}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        {stream.thumbnailUrl ? (
          <img
            src={stream.thumbnailUrl}
            alt={stream.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-hover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-sm right-sm font-mono text-3xs text-white/85 bg-black/45 px-1.5 py-px rounded-xs backdrop-blur-xs">
          {stream.songs.length}曲
        </span>
      </div>
      <div className="px-3 py-2.5 pb-3">
        <div className="font-mono text-3xs text-subtle">
          {formatDate(stream.date)}
        </div>
        <div className="text-xs font-semibold text-heading leading-[1.4] mt-0.5 line-clamp-2">
          {stream.title}
        </div>
      </div>
    </div>
  );
}
