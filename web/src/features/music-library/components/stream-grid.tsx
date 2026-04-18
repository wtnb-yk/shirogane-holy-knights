'use client';

import { useEffect, useRef, useState } from 'react';
import type { MusicStream } from '@/lib/data/types';
import { StreamDetail } from './stream-detail';

type Props = {
  streams: MusicStream[];
  /** 外部から指定された展開対象の videoId（フィードカード経由） */
  externalSelectedId?: string | null;
  onClearExternal?: () => void;
};

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

export function StreamGrid({
  streams,
  externalSelectedId,
  onClearExternal,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cols, setCols] = useState(4);
  const gridRef = useRef<HTMLDivElement>(null);

  // props → state 同期（React 推奨パターン）
  const [prevExternalId, setPrevExternalId] = useState<string | null>(null);
  if (externalSelectedId && externalSelectedId !== prevExternalId) {
    setPrevExternalId(externalSelectedId);
    setSelectedId(externalSelectedId);
    onClearExternal?.();
  }
  if (!externalSelectedId && prevExternalId) {
    setPrevExternalId(null);
  }

  // グリッドの実際の列数を取得
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const colCount =
        getComputedStyle(el).gridTemplateColumns.split(' ').length;
      setCols(colCount);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      <StreamCard
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
          title={selectedStream.title}
          date={selectedStream.date}
          songs={selectedStream.songs}
          onClose={() => setSelectedId(null)}
        />,
      );
    }
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-md"
    >
      {elements}
    </div>
  );
}

function StreamCard({
  stream,
  isSelected,
  onClick,
}: {
  stream: MusicStream;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border rounded-md overflow-hidden cursor-pointer transition-all duration-300 ease-out-expo ${
        isSelected
          ? 'border-accent shadow-[0_4px_20px_rgba(200,162,76,0.15)]'
          : 'border-border hover:border-border-hover hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
      }`}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        {stream.thumbnailUrl ? (
          <img
            src={stream.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-hover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-sm right-sm font-mono text-3xs text-white/85 bg-black/45 px-1.5 py-px rounded-xs backdrop-blur-xs">
          {stream.songs.length}曲
        </span>
      </div>
      <div className="px-3 py-2.5 pb-3">
        <div className="font-mono text-3xs text-subtle">
          {formatDate(stream.date)}
        </div>
        <div className="text-xs font-semibold text-heading leading-[1.4] mt-0.5 line-clamp-2">
          {stream.title}
        </div>
      </div>
    </div>
  );
}
