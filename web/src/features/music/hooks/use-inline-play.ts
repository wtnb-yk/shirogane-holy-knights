import { useState } from 'react';

/** インライン再生のトグル状態を管理する */
export function useInlinePlay(initialKey?: string | null) {
  const [playingKey, setPlayingKey] = useState<string | null>(
    initialKey ?? null,
  );

  const toggle = (key: string) =>
    setPlayingKey((prev) => (prev === key ? null : key));

  const isPlaying = (key: string) => playingKey === key;

  return { playingKey, toggle, isPlaying };
}
