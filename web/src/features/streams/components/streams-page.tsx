'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { Stream, StreamTagWithCount } from '@/lib/data/types';
import { PageHeader } from '@/components/ui/page-header';
import {
  getCheckedSnapshot,
  getCheckedServerSnapshot,
  subscribeChecked,
  toggleChecked,
  bulkCheck,
} from '../lib/checked-streams';
import { useStreamFilter } from '../hooks/use-stream-filter';
import { StreamToolbar } from './stream-toolbar';
import { ActiveChips } from './active-chips';
import { StreamGrid } from './stream-grid';
import { ProgressBar } from './progress-bar';

type Props = {
  streams: Stream[];
  tagsWithCount: StreamTagWithCount[];
};

export function StreamsPage({ streams, tagsWithCount }: Props) {
  const checkedIds = useSyncExternalStore(
    subscribeChecked,
    getCheckedSnapshot,
    getCheckedServerSnapshot,
  );

  const filter = useStreamFilter(streams, tagsWithCount, checkedIds);
  const handleToggleCheck = useCallback((id: string) => toggleChecked(id), []);
  const isClient = checkedIds !== getCheckedServerSnapshot();

  const uncheckedVisible = useMemo(
    () => filter.visible.filter((s) => !checkedIds.has(s.id)),
    [filter.visible, checkedIds],
  );

  const handleBulkCheck = useCallback(() => {
    const ids = uncheckedVisible.map((s) => s.id);
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `表示中の未チェック ${ids.length} 件をまとめてチェックしますか？`,
      )
    )
      return;
    bulkCheck(ids);
  }, [uncheckedVisible]);

  return (
    <>
      <PageHeader
        title="配信"
        description="配信を探索し、視聴した配信をチェック。あなたの推し活記録を作ろう。"
        right={
          isClient ? (
            <ProgressBar checked={checkedIds.size} total={streams.length} />
          ) : undefined
        }
      />
      <StreamToolbar
        categoryTabs={filter.categoryTabs}
        activeCategory={filter.activeCategory}
        activePanelTags={filter.activePanelTags}
        search={filter.search}
        sortOrder={filter.sortOrder}
        checkFilter={filter.checkFilter}
        filteredCount={filter.filtered.length}
        panelTags={filter.panelTags}
        filterBadgeCount={
          filter.activePanelTags.size + (filter.checkFilter !== 'all' ? 1 : 0)
        }
        onSelectCategory={filter.selectCategory}
        onTogglePanelTag={filter.togglePanelTag}
        onSearch={filter.updateSearch}
        onToggleSort={filter.toggleSort}
        onCheckFilter={filter.updateCheckFilter}
        onClearAll={filter.clearAll}
      />
      <ActiveChips
        filters={filter.activeFilters}
        onRemove={filter.removeFilter}
      />
      <StreamGrid
        visible={filter.visible}
        hasMore={filter.hasMore}
        filteredCount={filter.filtered.length}
        checkedIds={checkedIds}
        uncheckedVisibleCount={uncheckedVisible.length}
        onToggleCheck={handleToggleCheck}
        onLoadMore={filter.loadMore}
        onBulkCheck={handleBulkCheck}
      />
    </>
  );
}
