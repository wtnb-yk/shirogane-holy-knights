'use client';

import { useEffect, useRef, useState } from 'react';
import type { MusicStream } from '@/lib/data/types';
import { useGridColumns } from '../hooks/use-grid-columns';
import { MusicStreamCard } from './music-stream-card';
import { StreamDetail } from './stream-detail';

type Props = {
  streams: MusicStream[];
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
  /** 外部から指定された展開対象の videoId（フィードカード経由） */
  externalSelectedId?: string | null;
  onClearExternal?: () => void;
  /** 外部から指定された自動再生開始秒数（ハブ経由） */
  externalStartSeconds?: number | null;
};

/** 配信カードグリッド + 行末Detail展開 */
export function StreamGrid({
  streams,
  favoriteIds,
  onToggleFavorite,
  externalSelectedId,
  onClearExternal,
  externalStartSeconds,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cols = useGridColumns(gridRef);

  // props → state 同期
  const [prevExternalId, setPrevExternalId] = useState<string | null>(null);
  if (externalSelectedId && externalSelectedId !== prevExternalId) {
    setPrevExternalId(externalSelectedId);
    setSelectedId(externalSelectedId);
    onClearExternal?.();
  }
  if (!externalSelectedId && prevExternalId) {
    setPrevExternalId(null);
  }

  // 外部選択時のスクロール
  useEffect(() => {
    if (externalSelectedId) {
      const timer = setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [externalSelectedId]);

  const handleSelect = (videoId: string) => {
    setSelectedId((prev) => (prev === videoId ? null : videoId));
  };

  const selectedStream = streams.find((s) => s.videoId === selectedId);
  const selectedIdx = streams.findIndex((s) => s.videoId === selectedId);

  // Detail を行末に挿入する位置を計算（プロトタイプ準拠）
  const rowEndIdx =
    selectedIdx >= 0
      ? Math.min(
          Math.floor(selectedIdx / cols) * cols + cols - 1,
          streams.length - 1,
        )
      : -1;

  const elements: React.ReactNode[] = [];
  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i];
    elements.push(
      <MusicStreamCard
        key={stream.videoId}
        stream={stream}
        isSelected={stream.videoId === selectedId}
        onClick={() => handleSelect(stream.videoId)}
      />,
    );
    if (i === rowEndIdx && selectedStream) {
      elements.push(
        <StreamDetail
          key={`detail-${selectedStream.videoId}`}
          videoId={selectedStream.videoId}
          title={selectedStream.title}
          date={selectedStream.date}
          songs={selectedStream.songs}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
          onClose={() => setSelectedId(null)}
          autoPlayStartSeconds={externalStartSeconds}
        />,
      );
    }
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-md"
    >
      {elements}
    </div>
  );
}
