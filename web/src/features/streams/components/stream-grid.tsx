import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { LoadMore } from '@/components/ui/load-more';
import { NoResults } from '@/components/ui/no-results';
import { StreamCard } from './stream-card';

type Props = {
  visible: Stream[];
  hasMore: boolean;
  filteredCount: number;
  checkedIds: Set<string>;
  uncheckedVisibleCount: number;
  onToggleCheck: (id: string) => void;
  onLoadMore: () => void;
  onBulkCheck: () => void;
};

export function StreamGrid({
  visible,
  hasMore,
  filteredCount,
  checkedIds,
  uncheckedVisibleCount,
  onToggleCheck,
  onLoadMore,
  onBulkCheck,
}: Props) {
  if (visible.length === 0) {
    return (
      <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg">
        <NoResults />
      </div>
    );
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg py-md pb-2xl">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-md">
        {visible.map((stream) => (
          <StreamCard
            key={stream.id}
            stream={stream}
            isChecked={checkedIds.has(stream.id)}
            onToggleCheck={onToggleCheck}
          />
        ))}
      </div>
      {hasMore && (
        <LoadMore
          visibleCount={visible.length}
          totalCount={filteredCount}
          onLoadMore={onLoadMore}
        />
      )}
      {uncheckedVisibleCount > 0 && (
        <div className={`flex justify-center ${hasMore ? 'pt-sm' : 'pt-xl'}`}>
          <Button variant="ghost" onClick={onBulkCheck}>
            ここまでをまとめてチェック（{uncheckedVisibleCount}件）
          </Button>
        </div>
      )}
    </div>
  );
}
