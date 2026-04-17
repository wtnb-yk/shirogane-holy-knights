import { readCsv } from './csv-reader';
import type {
  ChannelRow,
  VideoRow,
  VideoTypeRow,
  VideoVideoTypeRow,
  StreamDetailRow,
  HiddenStreamRow,
  StreamTagRow,
  VideoStreamTagRow,
  Stream,
  Channel,
  StreamTag,
  StreamTagWithCount,
} from './types';

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

  const videos = readCsv<VideoRow>('videos.csv');
  const videoTypes = readCsv<VideoTypeRow>('video_types.csv');
  const videoVideoTypes = readCsv<VideoVideoTypeRow>('video_video_types.csv');
  const streamDetails = readCsv<StreamDetailRow>('stream_details.csv');
  const hiddenStreams = readCsv<HiddenStreamRow>('hidden_streams.csv');
  const channels = readCsv<ChannelRow>('channels.csv');
  const streamTagRows = readCsv<StreamTagRow>('stream_tags.csv');
  const videoStreamTags = readCsv<VideoStreamTagRow>('video_stream_tags.csv');

  // stream の video_type_id を取得
  const streamTypeId = videoTypes.find((vt) => vt.type === 'stream')?.id ?? '1';

  // 配信動画IDのセット
  const streamVideoIds = new Set(
    videoVideoTypes
      .filter((vvt) => vvt.video_type_id === streamTypeId)
      .map((vvt) => vvt.video_id),
  );

  // 非表示動画IDのセット
  const hiddenVideoIds = new Set(hiddenStreams.map((h) => h.video_id));

  // ルックアップマップ
  const streamDetailMap = new Map(streamDetails.map((sd) => [sd.video_id, sd]));
  const channelMap = new Map(channels.map((c) => [c.id, c]));
  const tagMap = new Map(streamTagRows.map((t) => [t.id, t]));

  // video_id → StreamTag[] マップ
  const videoTagsMap = new Map<string, StreamTag[]>();
  for (const vst of videoStreamTags) {
    const tagRow = tagMap.get(vst.tag_id);
    if (!tagRow) continue;
    const tags = videoTagsMap.get(vst.video_id) ?? [];
    tags.push({ id: Number(tagRow.id), name: tagRow.name });
    videoTagsMap.set(vst.video_id, tags);
  }

  // フィルタ + 結合
  const streams: Stream[] = videos
    .filter((v) => streamVideoIds.has(v.id) && !hiddenVideoIds.has(v.id))
    .map((v) => {
      const detail = streamDetailMap.get(v.id);
      const channelRow = channelMap.get(v.channel_id);
      const channel: Channel = channelRow
        ? {
            id: channelRow.id,
            title: channelRow.title,
            handle: channelRow.handle,
            iconUrl: channelRow.icon_url,
          }
        : { id: v.channel_id, title: '', handle: '', iconUrl: '' };

      return {
        id: v.id,
        title: v.title,
        thumbnailUrl: v.thumbnail_url,
        duration: v.duration,
        channel,
        publishedAt: v.published_at,
        startedAt: detail?.started_at ?? v.published_at,
        tags: videoTagsMap.get(v.id) ?? [],
      };
    })
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));

  cachedStreams = streams;
  return streams;
}

/**
 * 配信タグ一覧を取得（フィルタUI用）
 */
export function getStreamTags(): StreamTag[] {
  const tags = readCsv<StreamTagRow>('stream_tags.csv');
  return tags
    .map((t) => ({ id: Number(t.id), name: t.name }))
    .sort((a, b) => a.id - b.id);
}

/**
 * 配信タグに紐づく配信件数を付与して返す（件数降順）
 *
 * カテゴリタブ等の表示優先度判定に使う。
 */
export function getStreamTagsWithCount(): StreamTagWithCount[] {
  const streams = getStreams();
  const tags = getStreamTags();

  const countMap = new Map<number, number>();
  for (const s of streams) {
    for (const t of s.tags) {
      countMap.set(t.id, (countMap.get(t.id) ?? 0) + 1);
    }
  }

  return tags
    .map((t) => ({ ...t, count: countMap.get(t.id) ?? 0 }))
    .sort((a, b) => b.count - a.count);
}
