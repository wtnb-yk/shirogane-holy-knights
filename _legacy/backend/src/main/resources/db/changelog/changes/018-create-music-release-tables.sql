--liquibase formatted sql

--changeset shirogane:018-create-music-release-tables
--comment: 音楽リリース管理用テーブルの作成

-- マスターテーブル: 音楽配信プラットフォーム
CREATE TABLE music_platforms
(
    id            SERIAL PRIMARY KEY,
    platform_name VARCHAR(100) NOT NULL UNIQUE,
    base_url      VARCHAR(255),
    icon_url      VARCHAR(255),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- マスターテーブル: アルバムタイプ
CREATE TABLE album_types
(
    id          SERIAL PRIMARY KEY,
    type_name   VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- リリース楽曲の追加情報
CREATE TABLE released_songs
(
    song_id    UUID PRIMARY KEY REFERENCES songs (id) ON DELETE CASCADE,
    composer   VARCHAR(255),
    lyricist   VARCHAR(255),
    arranger   VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- アルバム情報
CREATE TABLE albums
(
    id              UUID PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    artist          VARCHAR(255) NOT NULL,
    album_type_id   INTEGER NOT NULL REFERENCES album_types (id),
    release_date    DATE,
    cover_image_url VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- アルバム収録楽曲
CREATE TABLE album_songs
(
    album_id     UUID NOT NULL REFERENCES albums (id) ON DELETE CASCADE,
    song_id      UUID NOT NULL REFERENCES songs (id) ON DELETE CASCADE,
    track_number INTEGER NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (album_id, song_id)
);

-- 音楽配信プラットフォーム別リリース情報
CREATE TABLE music_releases
(
    id               UUID PRIMARY KEY,
    song_id          UUID NOT NULL REFERENCES songs (id) ON DELETE CASCADE,
    platform_id      INTEGER NOT NULL REFERENCES music_platforms (id),
    platform_song_id VARCHAR(255),
    url              VARCHAR(500) NOT NULL,
    release_date     DATE NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (song_id, platform_id)
);

-- インデックス
CREATE INDEX idx_released_songs_song_id ON released_songs(song_id);
CREATE INDEX idx_albums_album_type_id ON albums(album_type_id);
CREATE INDEX idx_albums_release_date ON albums(release_date DESC);
CREATE INDEX idx_albums_artist ON albums(artist);
CREATE INDEX idx_album_songs_album_id ON album_songs(album_id);
CREATE INDEX idx_album_songs_song_id ON album_songs(song_id);
CREATE INDEX idx_music_releases_song_id ON music_releases(song_id);
CREATE INDEX idx_music_releases_platform_id ON music_releases(platform_id);
CREATE INDEX idx_music_releases_release_date ON music_releases(release_date DESC);

--rollback DROP INDEX IF EXISTS idx_music_releases_release_date;
--rollback DROP INDEX IF EXISTS idx_music_releases_platform_id;
--rollback DROP INDEX IF EXISTS idx_music_releases_song_id;
--rollback DROP INDEX IF EXISTS idx_album_songs_song_id;
--rollback DROP INDEX IF EXISTS idx_album_songs_album_id;
--rollback DROP INDEX IF EXISTS idx_albums_artist;
--rollback DROP INDEX IF EXISTS idx_albums_release_date;
--rollback DROP INDEX IF EXISTS idx_albums_album_type_id;
--rollback DROP INDEX IF EXISTS idx_released_songs_song_id;
--rollback DROP TABLE IF EXISTS music_releases;
--rollback DROP TABLE IF EXISTS album_songs;
--rollback DROP TABLE IF EXISTS albums;
--rollback DROP TABLE IF EXISTS released_songs;
--rollback DROP TABLE IF EXISTS album_types;
--rollback DROP TABLE IF EXISTS music_platforms;