'use client';

import { useCallback, useState } from 'react';
import type { StreamTagWithCount } from '@/lib/data/types';
import { ToolbarIconButton } from '@/components/ui/toolbar-actions';
import { FilterPanel } from '@/components/ui/filter-panel';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FilterIcon } from '@/components/icons/toolbar-icons';
import type { CheckFilter } from '../hooks/use-stream-filter';
import { StreamFilterContent } from './stream-filter-content';

type Props = {
  allTags: StreamTagWithCount[];
  activeTags: Set<number>;
  checkFilter: CheckFilter;
  badgeCount: number;
  onToggleTag: (id: number) => void;
  onCheckFilter: (f: CheckFilter) => void;
  onClearAll: () => void;
};

export function StreamFilterOverlay({
  allTags,
  activeTags,
  checkFilter,
  badgeCount,
  onToggleTag,
  onCheckFilter,
  onClearAll,
}: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const filterContent = (
    <StreamFilterContent
      allTags={allTags}
      activeTags={activeTags}
      checkFilter={checkFilter}
      onToggleTag={onToggleTag}
      onCheckFilter={onCheckFilter}
    />
  );

  return (
    <>
      {/* トリガーボタン + デスクトップパネル */}
      <div className="relative">
        <ToolbarIconButton
          title="絞り込み"
          badge={badgeCount}
          onClick={() => setOpen((o) => !o)}
        >
          <FilterIcon />
        </ToolbarIconButton>
        <div className="hidden md:block">
          <FilterPanel open={open} onClose={close} onClearAll={onClearAll}>
            {filterContent}
          </FilterPanel>
        </div>
      </div>

      {/* モバイル: ボトムシート */}
      <div className="md:hidden">
        <BottomSheet
          open={open}
          onClose={close}
          title="絞り込み"
          headerRight={
            <button
              onClick={onClearAll}
              className="font-body text-xs text-muted hover:text-heading cursor-pointer transition-colors duration-250 ease-out-expo"
            >
              すべて解除
            </button>
          }
        >
          {filterContent}
        </BottomSheet>
      </div>
    </>
  );
}
