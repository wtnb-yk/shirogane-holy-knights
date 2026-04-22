import { useMemo, useState } from 'react';
import type { Stream, StreamTagWithCount } from '@/lib/data/types';

export type SortOrder = 'newest' | 'oldest';
export type CheckFilter = 'all' | 'checked' | 'unchecked';

export type ActiveFilter = {
  label: string;
  key: string;
};

/** クイックタグ（カテゴリタブ）の最大表示数 */
const MAX_QUICK_TAGS = 7;
const PAGE_SIZE = 40;

export function useStreamFilter(
  allStreams: Stream[],
  tagsWithCount: StreamTagWithCount[],
  checkedIds: Set<string>,
) {
  const [activeTags, setActiveTags] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [checkFilter, setCheckFilter] = useState<CheckFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // クイックタグ: 件数上位をカテゴリタブとして表示
  // allTags: 全タグをフィルタパネルに表示
  const quickTags = tagsWithCount.slice(0, MAX_QUICK_TAGS);
  const allTags = tagsWithCount;

  const filtered = useMemo(() => {
    let result = allStreams;

    if (activeTags.size > 0) {
      result = result.filter((s) =>
        [...activeTags].every((tagId) => s.tags.some((t) => t.id === tagId)),
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
  }, [allStreams, activeTags, search, sortOrder, checkFilter, checkedIds]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeFilters = useMemo(() => {
    const chips: ActiveFilter[] = [];
    for (const tagId of activeTags) {
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
  }, [activeTags, checkFilter, tagsWithCount]);

  const resetPage = () => setVisibleCount(PAGE_SIZE);

  return {
    activeTags,
    search,
    sortOrder,
    checkFilter,
    filtered,
    visible,
    hasMore,
    quickTags,
    allTags,
    activeFilters,
    selectTag(tagId: number | null) {
      setActiveTags(tagId === null ? new Set() : new Set([tagId]));
      resetPage();
    },
    toggleTag(tagId: number) {
      setActiveTags((prev) => {
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
      if (key.startsWith('tag:')) {
        const tagId = Number(key.slice(4));
        setActiveTags((prev) => {
          const next = new Set(prev);
          next.delete(tagId);
          return next;
        });
      } else if (key.startsWith('check:')) {
        setCheckFilter('all');
      }
      resetPage();
    },
    clearAll() {
      setActiveTags(new Set());
      setCheckFilter('all');
      setSearch('');
      resetPage();
    },
    loadMore() {
      setVisibleCount((c) => c + PAGE_SIZE);
    },
  };
}
