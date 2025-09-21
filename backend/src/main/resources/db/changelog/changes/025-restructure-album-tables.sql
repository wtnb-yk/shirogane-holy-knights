--liquibase formatted sql

--changeset shirogane:019-restructure-album-tables
--comment: アルバム関連テーブルの構造を全面改修

-- 既存テーブルの削除（CASCADE指定で依存関係も含めて削除）
DROP TABLE IF EXISTS music_releases CASCADE;
DROP TABLE IF EXISTS album_songs CASCADE;
DROP TABLE IF EXISTS albums CASCADE;

-- アルバム情報（ID型を文字列に変更）
CREATE TABLE albums
(
    id              VARCHAR(255) PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    artist          VARCHAR(255) NOT NULL,
    album_type_id   INTEGER NOT NULL REFERENCES album_types (id),
    release_date    DATE,
    cover_image_url VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- アルバムトラック（旧album_songs、idカラム追加）
CREATE TABLE album_tracks
(
    id           VARCHAR(255) PRIMARY KEY,
    album_id     VARCHAR(255) NOT NULL REFERENCES albums (id) ON DELETE CASCADE,
    song_id      UUID NOT NULL REFERENCES songs (id) ON DELETE CASCADE,
    track_number INTEGER NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (album_id, song_id)
);

-- トラックリリース情報（旧music_releases、album_track_idに紐づけ）
CREATE TABLE track_releases
(
    id               VARCHAR(255) PRIMARY KEY,
    album_track_id   VARCHAR(255) NOT NULL REFERENCES album_tracks (id) ON DELETE CASCADE,
    platform_id      INTEGER NOT NULL REFERENCES music_platforms (id),
    platform_url     VARCHAR(500) NOT NULL,
    release_date     DATE NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (album_track_id, platform_id)
);

-- アルバムリリース情報（新規作成）
CREATE TABLE album_releases
(
    id               VARCHAR(255) PRIMARY KEY,
    album_id         VARCHAR(255) NOT NULL REFERENCES albums (id) ON DELETE CASCADE,
    platform_id      INTEGER NOT NULL REFERENCES music_platforms (id),
    platform_url     VARCHAR(500) NOT NULL,
    release_date     DATE NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (album_id, platform_id)
);

-- インデックス
CREATE INDEX idx_albums_album_type_id ON albums(album_type_id);
CREATE INDEX idx_albums_release_date ON albums(release_date DESC);
CREATE INDEX idx_albums_artist ON albums(artist);
CREATE INDEX idx_album_tracks_album_id ON album_tracks(album_id);
CREATE INDEX idx_album_tracks_song_id ON album_tracks(song_id);
CREATE INDEX idx_track_releases_album_track_id ON track_releases(album_track_id);
CREATE INDEX idx_track_releases_platform_id ON track_releases(platform_id);
CREATE INDEX idx_track_releases_release_date ON track_releases(release_date DESC);
CREATE INDEX idx_album_releases_album_id ON album_releases(album_id);
CREATE INDEX idx_album_releases_platform_id ON album_releases(platform_id);
CREATE INDEX idx_album_releases_release_date ON album_releases(release_date DESC);

--rollback DROP INDEX IF EXISTS idx_album_releases_release_date;
--rollback DROP INDEX IF EXISTS idx_album_releases_platform_id;
--rollback DROP INDEX IF EXISTS idx_album_releases_album_id;
--rollback DROP INDEX IF EXISTS idx_track_releases_release_date;
--rollback DROP INDEX IF EXISTS idx_track_releases_platform_id;
--rollback DROP INDEX IF EXISTS idx_track_releases_album_track_id;
--rollback DROP INDEX IF EXISTS idx_album_tracks_song_id;
--rollback DROP INDEX IF EXISTS idx_album_tracks_album_id;
--rollback DROP INDEX IF EXISTS idx_albums_artist;
--rollback DROP INDEX IF EXISTS idx_albums_release_date;
--rollback DROP INDEX IF EXISTS idx_albums_album_type_id;
--rollback DROP TABLE IF EXISTS album_releases;
--rollback DROP TABLE IF EXISTS track_releases;
--rollback DROP TABLE IF EXISTS album_tracks;
--rollback DROP TABLE IF EXISTS albums;
--rollback -- Recreate original tables
--rollback CREATE TABLE albums (id UUID PRIMARY KEY, title VARCHAR(255) NOT NULL, artist VARCHAR(255) NOT NULL, album_type_id INTEGER NOT NULL REFERENCES album_types (id), release_date DATE, cover_image_url VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
--rollback CREATE TABLE album_songs (album_id UUID NOT NULL REFERENCES albums (id) ON DELETE CASCADE, song_id UUID NOT NULL REFERENCES songs (id) ON DELETE CASCADE, track_number INTEGER NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (album_id, song_id));
--rollback CREATE TABLE music_releases (id UUID PRIMARY KEY, song_id UUID NOT NULL REFERENCES songs (id) ON DELETE CASCADE, platform_id INTEGER NOT NULL REFERENCES music_platforms (id), platform_song_id VARCHAR(255), url VARCHAR(500) NOT NULL, release_date DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE (song_id, platform_id));