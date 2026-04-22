import { useMemo, useState } from 'react';
import type { Stream, StreamTagWithCount } from '@/lib/data/types';

export type SortOrder = 'newest' | 'oldest';
export type CheckFilter = 'all' | 'checked' | 'unchecked';

export type ActiveFilter = {
  label: string;
  key: string;
};

/** カテゴリタブの最大表示数（レイアウト制約: タブ行が折り返さずに収まる上限） */
const MAX_CATEGORY_TABS = 7;
const PAGE_SIZE = 40;

export function useStreamFilter(
  allStreams: Stream[],
  tagsWithCount: StreamTagWithCount[],
  checkedIds: Set<string>,
) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePanelTags, setActivePanelTags] = useState<Set<number>>(
    new Set(),
  );
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [checkFilter, setCheckFilter] = useState<CheckFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // カテゴリタブ: 件数上位をクイックフィルタとして表示（単一選択）
  // フィルタパネル: 全タグを詳細フィルタとして表示（複数選択）
  const categoryTabs = tagsWithCount.slice(0, MAX_CATEGORY_TABS);
  const panelTags = tagsWithCount;

  const filtered = useMemo(() => {
    let result = allStreams;

    if (activeCategory) {
      result = result.filter((s) =>
        s.tags.some((t) => t.name === activeCategory),
      );
    }

    if (activePanelTags.size > 0) {
      result = result.filter((s) =>
        [...activePanelTags].every((tagId) =>
          s.tags.some((t) => t.id === tagId),
        ),
      );
    }

    if (checkFilter === 'checked') {
      result = result.filter((s) => checkedIds.has(s.id));
    } else if (checkFilter === 'unchecked') {
      result = result.filter((s) => !checkedIds.has(s.id));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q));
    }

    if (sortOrder === 'oldest') {
      result = [...result].reverse();
    }

    return result;
  }, [
    allStreams,
    activeCategory,
    activePanelTags,
    search,
    sortOrder,
    checkFilter,
    checkedIds,
  ]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeFilters = useMemo(() => {
    const chips: ActiveFilter[] = [];
    if (activeCategory) {
      chips.push({ label: activeCategory, key: `cat:${activeCategory}` });
    }
    for (const tagId of activePanelTags) {
      const tag = tagsWithCount.find((t) => t.id === tagId);
      if (tag) chips.push({ label: tag.name, key: `tag:${tagId}` });
    }
    if (checkFilter !== 'all') {
      chips.push({
        label: checkFilter === 'checked' ? '視聴済' : '未視聴',
        key: `check:${checkFilter}`,
      });
    }
    return chips;
  }, [activeCategory, activePanelTags, checkFilter, tagsWithCount]);

  const resetPage = () => setVisibleCount(PAGE_SIZE);

  return {
    activeCategory,
    activePanelTags,
    search,
    sortOrder,
    checkFilter,
    filtered,
    visible,
    hasMore,
    categoryTabs,
    panelTags,
    activeFilters,
    selectCategory(cat: string | null) {
      setActiveCategory(cat);
      resetPage();
    },
    togglePanelTag(tagId: number) {
      setActivePanelTags((prev) => {
        const next = new Set(prev);
        if (next.has(tagId)) next.delete(tagId);
        else next.add(tagId);
        return next;
      });
      resetPage();
    },
    updateSearch(q: string) {
      setSearch(q);
      resetPage();
    },
    toggleSort() {
      setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'));
    },
    updateCheckFilter(f: CheckFilter) {
      setCheckFilter(f);
      resetPage();
    },
    removeFilter(key: string) {
      if (key.startsWith('cat:')) setActiveCategory(null);
      else if (key.startsWith('tag:')) {
        const tagId = Number(key.slice(4));
        setActivePanelTags((prev) => {
          const next = new Set(prev);
          next.delete(tagId);
          return next;
        });
      } else if (key.startsWith('check:')) setCheckFilter('all');
      resetPage();
    },
    clearAll() {
      setActiveCategory(null);
      setActivePanelTags(new Set());
      setCheckFilter('all');
      setSearch('');
      resetPage();
    },
    loadMore() {
      setVisibleCount((c) => c + PAGE_SIZE);
    },
  };
}
