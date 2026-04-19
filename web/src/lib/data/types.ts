// ============================================================
// Domain Types（camelCase、結合済みデータ）
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

// --- 楽曲 ---

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
