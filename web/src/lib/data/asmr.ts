import { getStreams } from './streams';
import type { Stream } from './types';

const ASMR_TAG_NAME = 'ASMR';

let cachedAsmrStreams: Stream[] | null = null;

/**
 * ASMR配信データを取得
 *
 * getStreams() の結果からASMRタグ付きのみをフィルタ
 * startedAt 降順（新しい順）でソート済み（getStreams のソート順を継承）
 */
export function getAsmrStreams(): Stream[] {
  if (cachedAsmrStreams) return cachedAsmrStreams;

  const streams = getStreams();
  cachedAsmrStreams = streams.filter((s) =>
    s.tags.some((t) => t.name === ASMR_TAG_NAME),
  );
  return cachedAsmrStreams;
}
