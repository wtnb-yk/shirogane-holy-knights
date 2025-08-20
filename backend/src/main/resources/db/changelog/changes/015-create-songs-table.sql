--liquibase formatted sql

--changeset shirogane:015-create-songs-table
--comment: 曲管理用テーブルの作成

CREATE TABLE songs
(
    id         UUID PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    artist     VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE original_songs
(
    song_id    UUID PRIMARY KEY REFERENCES songs (id) ON DELETE CASCADE,
    composer   VARCHAR(255),
    lyricist   VARCHAR(255),
    arranger   VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cover_songs
(
    song_id    UUID PRIMARY KEY REFERENCES songs (id) ON DELETE CASCADE,
    video_id   VARCHAR(50) REFERENCES videos (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stream_songs
(
    song_id    UUID REFERENCES songs (id) ON DELETE CASCADE,
    video_id   VARCHAR(50) REFERENCES videos (id) ON DELETE CASCADE,
    start_seconds INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (song_id, video_id)
);

CREATE TABLE live_songs
(
    song_id    UUID REFERENCES songs (id) ON DELETE CASCADE,
    video_id   VARCHAR(50) REFERENCES videos (id) ON DELETE CASCADE,
    start_seconds INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (song_id, video_id)
);

-- インデックス
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_artist ON songs(artist);
CREATE INDEX idx_cover_songs_video_id ON cover_songs(video_id);
CREATE INDEX idx_stream_songs_video_id ON stream_songs(video_id);
CREATE INDEX idx_stream_songs_song_id ON stream_songs(song_id);
CREATE INDEX idx_live_songs_video_id ON live_songs(video_id);
CREATE INDEX idx_live_songs_song_id ON live_songs(song_id);

--rollback DROP INDEX IF EXISTS idx_live_songs_song_id;
--rollback DROP INDEX IF EXISTS idx_live_songs_video_id;
--rollback DROP INDEX IF EXISTS idx_stream_songs_song_id;
--rollback DROP INDEX IF EXISTS idx_stream_songs_video_id;
--rollback DROP INDEX IF EXISTS idx_cover_songs_video_id;
--rollback DROP INDEX IF EXISTS idx_songs_artist;
--rollback DROP INDEX IF EXISTS idx_songs_title;
--rollback DROP TABLE IF EXISTS live_songs;
--rollback DROP TABLE IF EXISTS stream_songs;
--rollback DROP TABLE IF EXISTS cover_songs;
--rollback DROP TABLE IF EXISTS original_songs;
--rollback DROP TABLE IF EXISTS songs;
