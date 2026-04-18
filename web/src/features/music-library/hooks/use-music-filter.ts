import { useMemo, useState } from 'react';
import type { Song, MusicStream, MusicVideoCard } from '@/lib/data/types';

export type SourceTab = 'utawaku' | 'live' | 'mv';
export type ViewMode = 'stream' | 'song';
export type SortOrder = 'newest' | 'oldest';
export type SongSort = 'count' | 'recent' | 'name';

const PAGE_SIZE = 40;

/** 曲ビュー用: 歌唱回数・出現一覧付きの集約データ */
export type AggregatedSong = {
  id: string;
  title: string;
  artist: string;
  count: number;
  lastDate: string;
  appearances: {
    videoId: string;
    videoTitle: string;
    date: string;
    startSeconds: number;
  }[];
};

export function useMusicFilter(
  songs: Song[],
  utawakuStreams: MusicStream[],
  concertStreams: MusicStream[],
  mvCards: MusicVideoCard[],
) {
  const [activeTab, setActiveTab] = useState<SourceTab>('utawaku');
  const [viewMode, setViewMode] = useState<ViewMode>('stream');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [songSort, setSongSort] = useState<SongSort>('count');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 歌枠の曲ビュー用: 曲を集約
  const aggregatedSongs = useMemo(() => {
    const map = new Map<string, AggregatedSong>();
    for (const stream of utawakuStreams) {
      for (const s of stream.songs) {
        let agg = map.get(s.songId);
        if (!agg) {
          agg = {
            id: s.songId,
            title: s.title,
            artist: s.artist,
            count: 0,
            lastDate: '',
            appearances: [],
          };
          map.set(s.songId, agg);
        }
        agg.count++;
        if (stream.date > agg.lastDate) agg.lastDate = stream.date;
        agg.appearances.push({
          videoId: stream.videoId,
          videoTitle: stream.title,
          date: stream.date,
          startSeconds: s.startSeconds,
        });
      }
    }
    return Array.from(map.values());
  }, [utawakuStreams]);

  // 検索フィルタ
  const q = search.trim().toLowerCase();

  const filteredUtawaku = useMemo(() => {
    let result = q
      ? utawakuStreams.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.songs.some(
              (sg) =>
                sg.title.toLowerCase().includes(q) ||
                sg.artist.toLowerCase().includes(q),
            ),
        )
      : utawakuStreams;
    if (sortOrder === 'oldest') result = [...result].reverse();
    return result;
  }, [utawakuStreams, q, sortOrder]);

  const filteredConcerts = useMemo(() => {
    let result = q
      ? concertStreams.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.songs.some(
              (sg) =>
                sg.title.toLowerCase().includes(q) ||
                sg.artist.toLowerCase().includes(q),
            ),
        )
      : concertStreams;
    if (sortOrder === 'oldest') result = [...result].reverse();
    return result;
  }, [concertStreams, q, sortOrder]);

  const filteredMvCards = useMemo(
    () =>
      q
        ? mvCards.filter(
            (mv) =>
              mv.songTitle.toLowerCase().includes(q) ||
              mv.artist.toLowerCase().includes(q),
          )
        : mvCards,
    [mvCards, q],
  );

  const filteredAggSongs = useMemo(() => {
    let result = q
      ? aggregatedSongs.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.artist.toLowerCase().includes(q),
        )
      : aggregatedSongs;

    if (songSort === 'count') {
      result = [...result].sort((a, b) => b.count - a.count);
    } else if (songSort === 'recent') {
      result = [...result].sort((a, b) => b.lastDate.localeCompare(a.lastDate));
    } else {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'ja'));
    }
    return result;
  }, [aggregatedSongs, q, songSort]);

  // 横断検索用: 全曲を検索
  const crossSearchResults = useMemo(() => {
    if (!q) return [];
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q),
    );
  }, [songs, q]);

  // 現在のタブ・ビューに応じた件数
  const currentCount = useMemo(() => {
    if (activeTab === 'utawaku') {
      return viewMode === 'stream'
        ? filteredUtawaku.length
        : filteredAggSongs.length;
    }
    if (activeTab === 'live') return filteredConcerts.length;
    return filteredMvCards.length;
  }, [
    activeTab,
    viewMode,
    filteredUtawaku,
    filteredAggSongs,
    filteredConcerts,
    filteredMvCards,
  ]);

  // ページネーション（配信グリッド系のみ）
  const visibleUtawaku = filteredUtawaku.slice(0, visibleCount);
  const visibleConcerts = filteredConcerts.slice(0, visibleCount);
  const visibleMvCards = filteredMvCards.slice(0, visibleCount);
  const visibleAggSongs = filteredAggSongs.slice(0, visibleCount);

  const hasMore = (() => {
    if (activeTab === 'utawaku') {
      return viewMode === 'stream'
        ? visibleCount < filteredUtawaku.length
        : visibleCount < filteredAggSongs.length;
    }
    if (activeTab === 'live') return visibleCount < filteredConcerts.length;
    return visibleCount < filteredMvCards.length;
  })();

  const filteredTotal = (() => {
    if (activeTab === 'utawaku') {
      return viewMode === 'stream'
        ? filteredUtawaku.length
        : filteredAggSongs.length;
    }
    if (activeTab === 'live') return filteredConcerts.length;
    return filteredMvCards.length;
  })();

  const resetPage = () => setVisibleCount(PAGE_SIZE);

  return {
    activeTab,
    viewMode,
    search,
    sortOrder,
    songSort,
    currentCount,
    crossSearchResults,
    visibleUtawaku,
    visibleConcerts,
    visibleMvCards,
    visibleAggSongs,
    hasMore,
    filteredTotal,
    setActiveTab(tab: SourceTab) {
      setActiveTab(tab);
      resetPage();
    },
    setViewMode(mode: ViewMode) {
      setViewMode(mode);
      resetPage();
    },
    updateSearch(value: string) {
      setSearch(value);
      resetPage();
    },
    toggleSort() {
      setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'));
    },
    setSongSort(sort: SongSort) {
      setSongSort(sort);
      resetPage();
    },
    loadMore() {
      setVisibleCount((c) => c + PAGE_SIZE);
    },
  };
}
