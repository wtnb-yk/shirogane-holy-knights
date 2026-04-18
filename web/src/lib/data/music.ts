import { readCsv } from './csv-reader';
import type {
  SongRow,
  StreamSongRow,
  ConcertSongRow,
  MusicVideoRow,
  MusicVideoTypeRow,
  AlbumRow,
  AlbumTypeRow,
  AlbumTrackRow,
  VideoRow,
  StreamDetailRow,
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

  const songs = readCsv<SongRow>('songs.csv');
  const streamSongs = readCsv<StreamSongRow>('stream_songs.csv');
  const concertSongs = readCsv<ConcertSongRow>('concert_songs.csv');
  const musicVideos = readCsv<MusicVideoRow>('music_videos.csv');
  const musicVideoTypes = readCsv<MusicVideoTypeRow>('music_video_types.csv');
  const albums = readCsv<AlbumRow>('albums.csv');
  const albumTracks = readCsv<AlbumTrackRow>('album_tracks.csv');
  const videos = readCsv<VideoRow>('videos.csv');

  const videoMap = new Map(videos.map((v) => [v.id, v]));
  const mvTypeMap = new Map(musicVideoTypes.map((t) => [t.id, t.type_name]));
  const albumMap = new Map(albums.map((a) => [a.id, a]));

  // song_id → 歌枠パフォーマンス
  const streamPerfsMap = new Map<string, SongPerformance[]>();
  for (const ss of streamSongs) {
    const video = videoMap.get(ss.video_id);
    const perfs = streamPerfsMap.get(ss.song_id) ?? [];
    perfs.push({
      videoId: ss.video_id,
      videoTitle: video?.title ?? '',
      startSeconds: Number(ss.start_seconds),
    });
    streamPerfsMap.set(ss.song_id, perfs);
  }

  // song_id → ライブパフォーマンス
  const concertPerfsMap = new Map<string, SongPerformance[]>();
  for (const cs of concertSongs) {
    const video = videoMap.get(cs.video_id);
    const perfs = concertPerfsMap.get(cs.song_id) ?? [];
    perfs.push({
      videoId: cs.video_id,
      videoTitle: video?.title ?? '',
      startSeconds: Number(cs.start_seconds),
    });
    concertPerfsMap.set(cs.song_id, perfs);
  }

  // song_id → MV
  const songMvMap = new Map<string, SongMusicVideo[]>();
  for (const mv of musicVideos) {
    const video = videoMap.get(mv.video_id);
    const mvs = songMvMap.get(mv.song_id) ?? [];
    mvs.push({
      videoId: mv.video_id,
      videoTitle: video?.title ?? '',
      type: mvTypeMap.get(mv.music_video_type_id) ?? '',
    });
    songMvMap.set(mv.song_id, mvs);
  }

  // song_id → 収録アルバム
  const songAlbumsMap = new Map<string, SongAlbumInfo[]>();
  for (const at of albumTracks) {
    const album = albumMap.get(at.album_id);
    const infos = songAlbumsMap.get(at.song_id) ?? [];
    infos.push({
      albumId: at.album_id,
      albumTitle: album?.title ?? '',
      trackNumber: Number(at.track_number),
    });
    songAlbumsMap.set(at.song_id, infos);
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

  const albums = readCsv<AlbumRow>('albums.csv');
  const albumTypes = readCsv<AlbumTypeRow>('album_types.csv');
  const albumTracks = readCsv<AlbumTrackRow>('album_tracks.csv');
  const songs = readCsv<SongRow>('songs.csv');

  const albumTypeMap = new Map(albumTypes.map((t) => [t.id, t.type_name]));
  const songMap = new Map(songs.map((s) => [s.id, s]));

  // album_id → トラックリスト
  const albumTracksMap = new Map<string, AlbumTrack[]>();
  for (const at of albumTracks) {
    const song = songMap.get(at.song_id);
    const tracks = albumTracksMap.get(at.album_id) ?? [];
    tracks.push({
      id: at.id,
      trackNumber: Number(at.track_number),
      song: song
        ? { id: song.id, title: song.title, artist: song.artist }
        : { id: at.song_id, title: '', artist: '' },
    });
    albumTracksMap.set(at.album_id, tracks);
  }

  cachedAlbums = albums
    .map((a) => ({
      id: a.id,
      title: a.title,
      artist: a.artist,
      type: albumTypeMap.get(a.album_type_id) ?? '',
      releaseDate: a.release_date,
      coverImageUrl: a.cover_image_url,
      tracks: (albumTracksMap.get(a.id) ?? []).sort(
        (x, y) => x.trackNumber - y.trackNumber,
      ),
    }))
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));

  return cachedAlbums;
}

/**
 * セトリ付き配信データを構築するヘルパー
 *
 * stream_songs / concert_songs のような「song_id + video_id + start_seconds」形式の
 * 行データを、video_id でグループ化して MusicStream[] を返す
 */
function buildMusicStreams(
  rows: { song_id: string; video_id: string; start_seconds: string }[],
): MusicStream[] {
  const videos = readCsv<VideoRow>('videos.csv');
  const songs = readCsv<SongRow>('songs.csv');
  const streamDetails = readCsv<StreamDetailRow>('stream_details.csv');

  const videoMap = new Map(videos.map((v) => [v.id, v]));
  const songMap = new Map(songs.map((s) => [s.id, s]));
  const detailMap = new Map(streamDetails.map((sd) => [sd.video_id, sd]));

  // video_id → songs をグループ化
  const grouped = new Map<string, MusicStreamSong[]>();
  for (const row of rows) {
    const song = songMap.get(row.song_id);
    const list = grouped.get(row.video_id) ?? [];
    list.push({
      songId: row.song_id,
      title: song?.title ?? '',
      artist: song?.artist ?? '',
      startSeconds: Number(row.start_seconds),
    });
    grouped.set(row.video_id, list);
  }

  const result: MusicStream[] = [];
  for (const [videoId, songList] of grouped) {
    const video = videoMap.get(videoId);
    if (!video) continue;
    const detail = detailMap.get(videoId);
    result.push({
      videoId,
      title: video.title,
      thumbnailUrl: video.thumbnail_url,
      date: detail?.started_at ?? video.published_at,
      songs: songList.sort((a, b) => a.startSeconds - b.startSeconds),
    });
  }

  return result.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * 歌枠配信一覧（セトリ付き、日付降順）
 */
export function getUtawakuStreams(): MusicStream[] {
  if (cachedUtawakuStreams) return cachedUtawakuStreams;
  cachedUtawakuStreams = buildMusicStreams(
    readCsv<StreamSongRow>('stream_songs.csv'),
  );
  return cachedUtawakuStreams;
}

/**
 * ライブ/コンサート配信一覧（セトリ付き、日付降順）
 */
export function getConcertStreams(): MusicStream[] {
  if (cachedConcertStreams) return cachedConcertStreams;
  cachedConcertStreams = buildMusicStreams(
    readCsv<ConcertSongRow>('concert_songs.csv'),
  );
  return cachedConcertStreams;
}

/**
 * MVカード一覧（公開日降順）
 */
export function getMusicVideoCards(): MusicVideoCard[] {
  if (cachedMusicVideoCards) return cachedMusicVideoCards;

  const musicVideos = readCsv<MusicVideoRow>('music_videos.csv');
  const musicVideoTypes = readCsv<MusicVideoTypeRow>('music_video_types.csv');
  const videos = readCsv<VideoRow>('videos.csv');
  const songs = readCsv<SongRow>('songs.csv');

  const mvTypeMap = new Map(musicVideoTypes.map((t) => [t.id, t.type_name]));
  const videoMap = new Map(videos.map((v) => [v.id, v]));
  const songMap = new Map(songs.map((s) => [s.id, s]));

  cachedMusicVideoCards = musicVideos
    .map((mv) => {
      const video = videoMap.get(mv.video_id);
      const song = songMap.get(mv.song_id);
      return {
        songId: mv.song_id,
        songTitle: song?.title ?? '',
        artist: song?.artist ?? '',
        videoId: mv.video_id,
        videoTitle: video?.title ?? '',
        thumbnailUrl: video?.thumbnail_url ?? '',
        type: mvTypeMap.get(mv.music_video_type_id) ?? '',
        publishedAt: video?.published_at ?? '',
      };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return cachedMusicVideoCards;
}

/**
 * 楽曲ライブラリの統計情報
 */
export function getMusicStats(): MusicStats {
  return {
    songCount: getSongs().length,
    utawakuCount: getUtawakuStreams().length,
    liveCount: getConcertStreams().length,
    mvCount: getMusicVideoCards().length,
  };
}
