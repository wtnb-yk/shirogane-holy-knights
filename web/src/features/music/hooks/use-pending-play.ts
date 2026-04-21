import { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SourceTab } from './use-music-filter';

type FilterActions = {
  setActiveTab: (tab: SourceTab) => void;
  setViewMode: (mode: 'stream' | 'song') => void;
};

/**
 * フィードカード選択・URLパラメータ（?play=...&t=...）による
 * 配信展開＋自動再生を管理するフック
 */
export function usePendingPlay(filter: FilterActions) {
  const [pendingVideoId, setPendingVideoId] = useState<string | null>(null);
  const [pendingStartSeconds, setPendingStartSeconds] = useState<number | null>(
    null,
  );

  // URLパラメータからの自動再生（ハブ経由）— レンダー中の状態調整パターン
  const searchParams = useSearchParams();
  const [urlHandled, setUrlHandled] = useState(false);
  const urlPlay = searchParams.get('play');
  if (!urlHandled && urlPlay) {
    setUrlHandled(true);
    filter.setActiveTab('utawaku');
    filter.setViewMode('stream');
    setPendingVideoId(urlPlay);
    const t = searchParams.get('t');
    if (t) setPendingStartSeconds(Number(t));
  }

  // フィードカードからの配信展開
  const handleFeedSelect = useCallback(
    (type: SourceTab, videoId: string) => {
      filter.setActiveTab(type);
      if (type === 'utawaku' || type === 'live') {
        filter.setViewMode('stream');
        setPendingVideoId(videoId);
      }
    },
    [filter],
  );

  const clearPending = useCallback(() => {
    setPendingVideoId(null);
    setPendingStartSeconds(null);
  }, []);

  return {
    pendingVideoId,
    pendingStartSeconds,
    handleFeedSelect,
    clearPending,
  };
}
