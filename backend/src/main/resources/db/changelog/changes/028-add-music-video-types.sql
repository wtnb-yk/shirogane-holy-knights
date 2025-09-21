--liquibase formatted sql

--changeset shirogane:028-add-music-video-types
--comment: ミュージックビデオタイプの追加とmusic_videosテーブルの拡張

-- ミュージックビデオタイプマスターテーブルの作成
CREATE TABLE music_video_types
(
    id          SERIAL PRIMARY KEY,
    type_name   VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期データの挿入
INSERT INTO music_video_types (id, type_name, description)
VALUES
    (1, 'original', 'Original music video'),
    (2, 'cover', 'Cover version music video');

-- シーケンスの調整（次のIDが3から始まるように）
ALTER SEQUENCE music_video_types_id_seq RESTART WITH 3;

-- music_videosテーブルの削除と再作成（カラム順序を適切に配置）
DROP TABLE IF EXISTS music_videos CASCADE;

-- music_videosテーブルの再作成
CREATE TABLE music_videos
(
    song_id               UUID         NOT NULL REFERENCES songs (id) ON DELETE CASCADE,
    video_id              VARCHAR(50)  NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
    music_video_type_id   INTEGER      NOT NULL DEFAULT 1 REFERENCES music_video_types (id),
    created_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (song_id, video_id)
);

-- インデックスの作成
CREATE INDEX idx_music_videos_song_id ON music_videos(song_id);
CREATE INDEX idx_music_videos_video_id ON music_videos(video_id);
CREATE INDEX idx_music_videos_type_id ON music_videos(music_video_type_id);

--rollback DROP INDEX IF EXISTS idx_music_videos_type_id;
--rollback DROP INDEX IF EXISTS idx_music_videos_video_id;
--rollback DROP INDEX IF EXISTS idx_music_videos_song_id;
--rollback DROP TABLE IF EXISTS music_videos;
--rollback DROP TABLE IF EXISTS music_video_types;
--rollback -- Recreate original music_videos table
--rollback CREATE TABLE music_videos (song_id UUID NOT NULL REFERENCES songs (id) ON DELETE CASCADE, video_id VARCHAR(50) NOT NULL REFERENCES videos (id) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (song_id, video_id));
--rollback CREATE INDEX idx_music_videos_song_id ON music_videos(song_id);
--rollback CREATE INDEX idx_music_videos_video_id ON music_videos(video_id);