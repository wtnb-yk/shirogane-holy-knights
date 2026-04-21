import { getDb } from './db';
import type { Stream, Channel, StreamTag, StreamTagWithCount } from './types';
import { NOEL_CHANNEL_ID } from '@/lib/site';

let cachedStreams: Stream[] | null = null;

/**
 * 全配信データを取得
 *
 * - videos のうち type=stream のみ
 * - hidden_streams を除外
 * - stream_details, stream_tags, channels を結合
 * - startedAt 降順（新しい順）でソート済み
 */
export function getStreams(): Stream[] {
  if (cachedStreams) return cachedStreams;

  const db = getDb();

  // 配信一覧（チャンネル結合済み、startedAt降順）
  const rows = db
    .prepare(
      `
    SELECT
      v.id,
      v.title,
      v.thumbnail_url,
      v.duration,
      c.id AS channel_id,
      c.title AS channel_title,
      c.handle AS channel_handle,
      c.icon_url AS channel_icon_url,
      v.published_at,
      COALESCE(sd.started_at, v.published_at) AS started_at
    FROM videos v
    JOIN video_video_types vvt ON v.id = vvt.video_id
    JOIN video_types vt ON vvt.video_type_id = vt.id
    JOIN channels c ON v.channel_id = c.id
    LEFT JOIN stream_details sd ON v.id = sd.video_id
    WHERE vt.type = 'stream'
      AND v.channel_id = ?
      AND v.id NOT IN (SELECT video_id FROM hidden_streams)
    ORDER BY COALESCE(sd.started_at, v.published_at) DESC
  `,
    )
    .all(NOEL_CHANNEL_ID) as {
    id: string;
    title: string;
    thumbnail_url: string;
    duration: string;
    channel_id: string;
    channel_title: string;
    channel_handle: string;
    channel_icon_url: string;
    published_at: string;
    started_at: string;
  }[];

  // 全配信のタグを一括取得
  const tagRows = db
    .prepare(
      `
    SELECT vst.video_id, st.id AS tag_id, st.name AS tag_name
    FROM video_stream_tags vst
    JOIN stream_tags st ON vst.tag_id = st.id
  `,
    )
    .all() as { video_id: string; tag_id: number; tag_name: string }[];

  const videoTagsMap = new Map<string, StreamTag[]>();
  for (const t of tagRows) {
    const tags = videoTagsMap.get(t.video_id) ?? [];
    tags.push({ id: t.tag_id, name: t.tag_name });
    videoTagsMap.set(t.video_id, tags);
  }

  cachedStreams = rows.map((r) => {
    const channel: Channel = {
      id: r.channel_id,
      title: r.channel_title,
      handle: r.channel_handle,
      iconUrl: r.channel_icon_url,
    };
    return {
      id: r.id,
      title: r.title,
      thumbnailUrl: r.thumbnail_url,
      duration: r.duration,
      channel,
      publishedAt: r.published_at,
      startedAt: r.started_at,
      tags: videoTagsMap.get(r.id) ?? [],
    };
  });

  return cachedStreams;
}

/**
 * 配信タグ一覧を取得（フィルタUI用）
 */
export function getStreamTags(): StreamTag[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT id, name FROM stream_tags ORDER BY id')
    .all() as { id: number; name: string }[];
  return rows.map((t) => ({ id: t.id, name: t.name }));
}

/**
 * 配信タグに紐づく配信件数を付与して返す（件数降順）
 *
 * カテゴリタブ等の表示優先度判定に使う。
 */
export function getStreamTagsWithCount(): StreamTagWithCount[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
    SELECT st.id, st.name, COUNT(vst.video_id) AS count
    FROM stream_tags st
    LEFT JOIN video_stream_tags vst ON st.id = vst.tag_id
    LEFT JOIN video_video_types vvt ON vst.video_id = vvt.video_id
    LEFT JOIN video_types vt ON vvt.video_type_id = vt.id
    LEFT JOIN hidden_streams hs ON vst.video_id = hs.video_id
    LEFT JOIN videos v ON vst.video_id = v.id
    WHERE (vt.type = 'stream' OR vt.type IS NULL)
      AND hs.video_id IS NULL
      AND (v.channel_id = ? OR v.channel_id IS NULL)
    GROUP BY st.id, st.name
    ORDER BY count DESC
  `,
    )
    .all(NOEL_CHANNEL_ID) as { id: number; name: string; count: number }[];
  return rows.map((t) => ({ id: t.id, name: t.name, count: t.count }));
}
