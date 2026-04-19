import { ToolbarIconButton } from '@/components/ui/toolbar-actions';

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

type Props = {
  sortOrder: 'newest' | 'oldest';
  onToggleSort: () => void;
  favOnly: boolean;
  onToggleFavOnly: () => void;
  currentCount: number;
};

export function MusicToolbar({
  sortOrder,
  onToggleSort,
  favOnly,
  onToggleFavOnly,
  currentCount,
}: Props) {
  return (
    <>
      <ToolbarIconButton
        title={favOnly ? 'すべて表示' : 'お気に入りのみ'}
        onClick={onToggleFavOnly}
        className={favOnly ? 'text-accent' : ''}
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill={favOnly ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={HEART_PATH} />
        </svg>
      </ToolbarIconButton>
      <ToolbarIconButton
        title={sortOrder === 'newest' ? '古い順に' : '新しい順に'}
        onClick={onToggleSort}
      >
        <svg
          className={`w-3 h-3 transition-transform duration-250 ease-out-expo ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 2v8M3 7l3 3 3-3" />
        </svg>
      </ToolbarIconButton>
      <span className="font-mono text-3xs text-subtle whitespace-nowrap px-xs">
        {currentCount}件
      </span>
    </>
  );
}
