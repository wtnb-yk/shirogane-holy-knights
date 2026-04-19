import { getDb } from './db';
import type {
  Song,
  Album,
  SongPerformance,
  SongMusicVideo,
  SongAlbumInfo,
  AlbumTrack,
  MusicStream,
  MusicStreamSong,
  MusicVideoCard,
  MusicStats,
} from './types';

let cachedSongs: Song[] | null = null;
let cachedAlbums: Album[] | null = null;
let cachedUtawakuStreams: MusicStream[] | null = null;
let cachedConcertStreams: MusicStream[] | null = null;
let cachedMusicVideoCards: MusicVideoCard[] | null = null;

/**
 * 全楽曲データを取得
 *
 * 各曲に以下を結合:
 * - 歌枠パフォーマンス（stream_songs）
 * - ライブパフォーマンス（concert_songs）
 * - MV（music_videos）
 * - 収録アルバム（album_tracks → albums）
 */
export function getSongs(): Song[] {
  if (cachedSongs) return cachedSongs;

  const db = getDb();

  const songs = db.prepare('SELECT id, title, artist FROM songs').all() as {
    id: string;
    title: string;
    artist: string;
  }[];

  // 歌枠パフォーマンス
  const streamPerfs = db
    .prepare(
      `
    SELECT ss.song_id, ss.video_id, v.title AS video_title, ss.start_seconds
    FROM stream_songs ss
    JOIN videos v ON ss.video_id = v.id
  `,
    )
    .all() as {
    song_id: string;
    video_id: string;
    video_title: string;
    start_seconds: number;
  }[];

  const streamPerfsMap = new Map<string, SongPerformance[]>();
  for (const p of streamPerfs) {
    const perfs = streamPerfsMap.get(p.song_id) ?? [];
    perfs.push({
      videoId: p.video_id,
      videoTitle: p.video_title,
      startSeconds: p.start_seconds,
    });
    streamPerfsMap.set(p.song_id, perfs);
  }

  // ライブパフォーマンス
  const concertPerfs = db
    .prepare(
      `
    SELECT cs.song_id, cs.video_id, v.title AS video_title, cs.start_seconds
    FROM concert_songs cs
    JOIN videos v ON cs.video_id = v.id
  `,
    )
    .all() as {
    song_id: string;
    video_id: string;
    video_title: string;
    start_seconds: number;
  }[];

  const concertPerfsMap = new Map<string, SongPerformance[]>();
  for (const p of concertPerfs) {
    const perfs = concertPerfsMap.get(p.song_id) ?? [];
    perfs.push({
      videoId: p.video_id,
      videoTitle: p.video_title,
      startSeconds: p.start_seconds,
    });
    concertPerfsMap.set(p.song_id, perfs);
  }

  // MV
  const mvRows = db
    .prepare(
      `
    SELECT mv.song_id, mv.video_id, v.title AS video_title, mvt.type_name AS type
    FROM music_videos mv
    JOIN videos v ON mv.video_id = v.id
    JOIN music_video_types mvt ON mv.music_video_type_id = mvt.id
  `,
    )
    .all() as {
    song_id: string;
    video_id: string;
    video_title: string;
    type: string;
  }[];

  const songMvMap = new Map<string, SongMusicVideo[]>();
  for (const mv of mvRows) {
    const mvs = songMvMap.get(mv.song_id) ?? [];
    mvs.push({
      videoId: mv.video_id,
      videoTitle: mv.video_title,
      type: mv.type,
    });
    songMvMap.set(mv.song_id, mvs);
  }

  // 収録アルバム
  const albumInfoRows = db
    .prepare(
      `
    SELECT at.song_id, at.album_id, a.title AS album_title, at.track_number
    FROM album_tracks at
    JOIN albums a ON at.album_id = a.id
  `,
    )
    .all() as {
    song_id: string;
    album_id: string;
    album_title: string;
    track_number: number;
  }[];

  const songAlbumsMap = new Map<string, SongAlbumInfo[]>();
  for (const ai of albumInfoRows) {
    const infos = songAlbumsMap.get(ai.song_id) ?? [];
    infos.push({
      albumId: ai.album_id,
      albumTitle: ai.album_title,
      trackNumber: ai.track_number,
    });
    songAlbumsMap.set(ai.song_id, infos);
  }

  cachedSongs = songs.map((s) => ({
    id: s.id,
    title: s.title,
    artist: s.artist,
    streamPerformances: streamPerfsMap.get(s.id) ?? [],
    concertPerformances: concertPerfsMap.get(s.id) ?? [],
    musicVideos: songMvMap.get(s.id) ?? [],
    albums: songAlbumsMap.get(s.id) ?? [],
  }));

  return cachedSongs;
}

/**
 * 全アルバムデータを取得
 *
 * 各アルバムにトラックリスト（楽曲情報込み）を結合
 * releaseDate 降順（新しい順）でソート済み
 */
export function getAlbums(): Album[] {
  if (cachedAlbums) return cachedAlbums;

  const db = getDb();

  const albums = db
    .prepare(
      `
    SELECT a.id, a.title, a.artist, atp.type_name AS type,
           a.release_date, a.cover_image_url
    FROM albums a
    JOIN album_types atp ON a.album_type_id = atp.id
    ORDER BY a.release_date DESC
  `,
    )
    .all() as {
    id: string;
    title: string;
    artist: string;
    type: string;
    release_date: string;
    cover_image_url: string;
  }[];

  const trackRows = db
    .prepare(
      `
    SELECT at.id, at.album_id, at.track_number,
           s.id AS song_id, s.title AS song_title, s.artist AS song_artist
    FROM album_tracks at
    JOIN songs s ON at.song_id = s.id
    ORDER BY at.track_number
  `,
    )
    .all() as {
    id: string;
    album_id: string;
    track_number: number;
    song_id: string;
    song_title: string;
    song_artist: string;
  }[];

  const albumTracksMap = new Map<string, AlbumTrack[]>();
  for (const t of trackRows) {
    const tracks = albumTracksMap.get(t.album_id) ?? [];
    tracks.push({
      id: t.id,
      trackNumber: t.track_number,
      song: { id: t.song_id, title: t.song_title, artist: t.song_artist },
    });
    albumTracksMap.set(t.album_id, tracks);
  }

  cachedAlbums = albums.map((a) => ({
    id: a.id,
    title: a.title,
    artist: a.artist,
    type: a.type,
    releaseDate: a.release_date,
    coverImageUrl: a.cover_image_url,
    tracks: albumTracksMap.get(a.id) ?? [],
  }));

  return cachedAlbums;
}

/**
 * セトリ付き配信データを構築するヘルパー
 */
function buildMusicStreams(
  table: 'stream_songs' | 'concert_songs',
): MusicStream[] {
  const db = getDb();

  const rows = db
    .prepare(
      `
    SELECT t.song_id, t.video_id, t.start_seconds,
           v.title AS video_title, v.thumbnail_url,
           s.title AS song_title, s.artist AS song_artist,
           COALESCE(sd.started_at, v.published_at) AS date
    FROM ${table} t
    JOIN videos v ON t.video_id = v.id
    JOIN songs s ON t.song_id = s.id
    LEFT JOIN stream_details sd ON t.video_id = sd.video_id
    ORDER BY date DESC, t.start_seconds ASC
  `,
    )
    .all() as {
    song_id: string;
    video_id: string;
    start_seconds: number;
    video_title: string;
    thumbnail_url: string;
    song_title: string;
    song_artist: string;
    date: string;
  }[];

  // video_id でグループ化
  const grouped = new Map<
    string,
    {
      videoTitle: string;
      thumbnailUrl: string;
      date: string;
      songs: MusicStreamSong[];
    }
  >();

  for (const r of rows) {
    let group = grouped.get(r.video_id);
    if (!group) {
      group = {
        videoTitle: r.video_title,
        thumbnailUrl: r.thumbnail_url,
        date: r.date,
        songs: [],
      };
      grouped.set(r.video_id, group);
    }
    group.songs.push({
      songId: r.song_id,
      title: r.song_title,
      artist: r.song_artist,
      startSeconds: r.start_seconds,
    });
  }

  return Array.from(grouped.entries()).map(([videoId, g]) => ({
    videoId,
    title: g.videoTitle,
    thumbnailUrl: g.thumbnailUrl,
    date: g.date,
    songs: g.songs,
  }));
}

/**
 * 歌枠配信一覧（セトリ付き、日付降順）
 */
export function getUtawakuStreams(): MusicStream[] {
  if (cachedUtawakuStreams) return cachedUtawakuStreams;
  cachedUtawakuStreams = buildMusicStreams('stream_songs');
  return cachedUtawakuStreams;
}

/**
 * ライブ/コンサート配信一覧（セトリ付き、日付降順）
 */
export function getConcertStreams(): MusicStream[] {
  if (cachedConcertStreams) return cachedConcertStreams;
  cachedConcertStreams = buildMusicStreams('concert_songs');
  return cachedConcertStreams;
}

/**
 * MVカード一覧（公開日降順）
 */
export function getMusicVideoCards(): MusicVideoCard[] {
  if (cachedMusicVideoCards) return cachedMusicVideoCards;

  const db = getDb();

  const mvCardRows = db
    .prepare(
      `
    SELECT mv.song_id, s.title AS song_title, s.artist,
           mv.video_id, v.title AS video_title, v.thumbnail_url,
           mvt.type_name AS type, v.published_at
    FROM music_videos mv
    JOIN songs s ON mv.song_id = s.id
    JOIN videos v ON mv.video_id = v.id
    JOIN music_video_types mvt ON mv.music_video_type_id = mvt.id
    ORDER BY v.published_at DESC
  `,
    )
    .all() as {
    song_id: string;
    song_title: string;
    artist: string;
    video_id: string;
    video_title: string;
    thumbnail_url: string;
    type: string;
    published_at: string;
  }[];

  cachedMusicVideoCards = mvCardRows.map((r) => ({
    songId: r.song_id,
    songTitle: r.song_title,
    artist: r.artist,
    videoId: r.video_id,
    videoTitle: r.video_title,
    thumbnailUrl: r.thumbnail_url,
    type: r.type,
    publishedAt: r.published_at,
  }));

  return cachedMusicVideoCards;
}

/**
 * 楽曲の統計情報
 */
export function getMusicStats(): MusicStats {
  const db = getDb();
  const row = db
    .prepare(
      `
    SELECT
      (SELECT COUNT(*) FROM songs) AS song_count,
      (SELECT COUNT(DISTINCT video_id) FROM stream_songs) AS utawaku_count,
      (SELECT COUNT(DISTINCT video_id) FROM concert_songs) AS live_count,
      (SELECT COUNT(*) FROM music_videos) AS mv_count
  `,
    )
    .get() as {
    song_count: number;
    utawaku_count: number;
    live_count: number;
    mv_count: number;
  };

  return {
    songCount: row.song_count,
    utawakuCount: row.utawaku_count,
    liveCount: row.live_count,
    mvCount: row.mv_count,
  };
}
