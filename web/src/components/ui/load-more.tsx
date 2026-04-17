import { Button } from './button';

type Props = {
  visibleCount: number;
  totalCount: number;
  onLoadMore: () => void;
};

export function LoadMore({ visibleCount, totalCount, onLoadMore }: Props) {
  return (
    <div className="flex flex-col items-center gap-sm pt-xl">
      <Button variant="secondary" onClick={onLoadMore}>
        さらに読み込む
      </Button>
      <span className="font-mono text-xs text-subtle">
        {visibleCount.toLocaleString()} / {totalCount.toLocaleString()}件
      </span>
    </div>
  );
}
