--liquibase formatted sql

--changeset shirogane:019-create-music-video-tables
--comment: ミュージックビデオ中間テーブルの作成

-- ミュージックビデオ中間テーブル
CREATE TABLE music_videos
(
    song_id    UUID         NOT NULL REFERENCES songs (id) ON DELETE CASCADE,
    video_id   VARCHAR(50)  NOT NULL REFERENCES videos (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (song_id, video_id)
);

-- インデックス
CREATE INDEX idx_music_videos_song_id ON music_videos(song_id);
CREATE INDEX idx_music_videos_video_id ON music_videos(video_id);

--rollback DROP INDEX IF EXISTS idx_music_videos_video_id;
--rollback DROP INDEX IF EXISTS idx_music_videos_song_id;
--rollback DROP TABLE IF EXISTS music_videos;