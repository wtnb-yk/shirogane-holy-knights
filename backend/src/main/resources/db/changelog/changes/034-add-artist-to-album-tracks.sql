--liquibase formatted sql

--changeset shirogane:034-add-artist-to-album-tracks
--comment: album_tracksテーブルにartistカラムを追加

-- 既存のalbum_tracksテーブルを削除（CASCADE指定で依存関係も含めて削除）
DROP TABLE IF EXISTS album_tracks CASCADE;

-- album_tracksテーブルを再作成（artistカラムを追加）
CREATE TABLE album_tracks
(
    id           UUID PRIMARY KEY,
    album_id     UUID NOT NULL REFERENCES albums (id) ON DELETE CASCADE,
    song_id      UUID NOT NULL REFERENCES songs (id) ON DELETE CASCADE,
    artist       VARCHAR(255) NOT NULL,
    track_number INTEGER NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (album_id, song_id)
);

-- インデックスの再作成
CREATE INDEX idx_album_tracks_album_id ON album_tracks(album_id);
CREATE INDEX idx_album_tracks_song_id ON album_tracks(song_id);

-- track_releasesテーブルも再作成（外部キー制約のため）
DROP TABLE IF EXISTS track_releases CASCADE;

CREATE TABLE track_releases
(
    id               UUID PRIMARY KEY,
    album_track_id   UUID NOT NULL REFERENCES album_tracks (id) ON DELETE CASCADE,
    platform_id      INTEGER NOT NULL REFERENCES music_platforms (id),
    platform_url     VARCHAR(500) NOT NULL,
    release_date     DATE NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (album_track_id, platform_id)
);

-- track_releasesのインデックス再作成
CREATE INDEX idx_track_releases_album_track_id ON track_releases(album_track_id);
CREATE INDEX idx_track_releases_platform_id ON track_releases(platform_id);
CREATE INDEX idx_track_releases_release_date ON track_releases(release_date DESC);

--rollback DROP INDEX IF EXISTS idx_track_releases_release_date;
--rollback DROP INDEX IF EXISTS idx_track_releases_platform_id;
--rollback DROP INDEX IF EXISTS idx_track_releases_album_track_id;
--rollback DROP TABLE IF EXISTS track_releases;
--rollback DROP INDEX IF EXISTS idx_album_tracks_song_id;
--rollback DROP INDEX IF EXISTS idx_album_tracks_album_id;
--rollback DROP TABLE IF EXISTS album_tracks;
--rollback CREATE TABLE album_tracks (id UUID PRIMARY KEY, album_id UUID NOT NULL REFERENCES albums (id) ON DELETE CASCADE, song_id UUID NOT NULL REFERENCES songs (id) ON DELETE CASCADE, track_number INTEGER NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE (album_id, song_id));
--rollback CREATE INDEX idx_album_tracks_album_id ON album_tracks(album_id);
--rollback CREATE INDEX idx_album_tracks_song_id ON album_tracks(song_id);
--rollback CREATE TABLE track_releases (id UUID PRIMARY KEY, album_track_id UUID NOT NULL REFERENCES album_tracks (id) ON DELETE CASCADE, platform_id INTEGER NOT NULL REFERENCES music_platforms (id), platform_url VARCHAR(500) NOT NULL, release_date DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE (album_track_id, platform_id));
--rollback CREATE INDEX idx_track_releases_album_track_id ON track_releases(album_track_id);
--rollback CREATE INDEX idx_track_releases_platform_id ON track_releases(platform_id);
--rollback CREATE INDEX idx_track_releases_release_date ON track_releases(release_date DESC);
