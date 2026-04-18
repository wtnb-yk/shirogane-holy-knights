// ============================================================
// Raw CSV Row Types（CSVカラム名と1:1対応、snake_case）
// ============================================================

// --- 動画基盤 ---

export type ChannelRow = {
  id: string;
  title: string;
  handle: string;
  icon_url: string;
};

export type VideoRow = {
  id: string;
  title: string;
  thumbnail_url: string;
  duration: string;
  channel_id: string;
  published_at: string;
};

export type VideoTypeRow = {
  id: string;
  type: string;
};

export type VideoVideoTypeRow = {
  video_id: string;
  video_type_id: string;
};

export type StreamDetailRow = {
  video_id: string;
  started_at: string;
};

export type HiddenStreamRow = {
  video_id: string;
};

// --- タグ ---

export type StreamTagRow = {
  id: string;
  name: string;
};

export type VideoStreamTagRow = {
  video_id: string;
  tag_id: string;
};

// --- 楽曲 ---

export type SongRow = {
  id: string;
  title: string;
  artist: string;
};

export type StreamSongRow = {
  song_id: string;
  video_id: string;
  start_seconds: string;
};

export type ConcertSongRow = {
  song_id: string;
  video_id: string;
  start_seconds: string;
};

// --- MV ---

export type MusicVideoTypeRow = {
  id: string;
  type_name: string;
};

export type MusicVideoRow = {
  song_id: string;
  video_id: string;
  music_video_type_id: string;
};

// --- アルバム ---

export type AlbumTypeRow = {
  id: string;
  type_name: string;
};

export type AlbumRow = {
  id: string;
  title: string;
  artist: string;
  album_type_id: string;
  release_date: string;
  cover_image_url: string;
};

export type AlbumTrackRow = {
  id: string;
  album_id: string;
  song_id: string;
  track_number: string;
};

// ============================================================
// Enriched Domain Types（camelCase、結合済みデータ）
// ============================================================

// --- 配信 ---

export type Channel = {
  id: string;
  title: string;
  handle: string;
  iconUrl: string;
};

export type StreamTag = {
  id: number;
  name: string;
};

export type StreamTagWithCount = StreamTag & {
  count: number;
};

export type Stream = {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  channel: Channel;
  publishedAt: string;
  startedAt: string;
  tags: StreamTag[];
};

// --- 楽曲・アルバム ---

export type SongPerformance = {
  videoId: string;
  videoTitle: string;
  startSeconds: number;
};

export type SongMusicVideo = {
  videoId: string;
  videoTitle: string;
  type: string;
};

export type SongAlbumInfo = {
  albumId: string;
  albumTitle: string;
  trackNumber: number;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  streamPerformances: SongPerformance[];
  concertPerformances: SongPerformance[];
  musicVideos: SongMusicVideo[];
  albums: SongAlbumInfo[];
};

export type AlbumTrack = {
  id: string;
  trackNumber: number;
  song: {
    id: string;
    title: string;
    artist: string;
  };
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  type: string;
  releaseDate: string;
  coverImageUrl: string;
  tracks: AlbumTrack[];
};

// --- 楽曲ライブラリ ---

export type MusicStreamSong = {
  songId: string;
  title: string;
  artist: string;
  startSeconds: number;
};

export type MusicStream = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  date: string;
  songs: MusicStreamSong[];
};

export type MusicVideoCard = {
  songId: string;
  songTitle: string;
  artist: string;
  videoId: string;
  videoTitle: string;
  thumbnailUrl: string;
  type: string;
  publishedAt: string;
};

export type MusicStats = {
  songCount: number;
  utawakuCount: number;
  liveCount: number;
  mvCount: number;
};
