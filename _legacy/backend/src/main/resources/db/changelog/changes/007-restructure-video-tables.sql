-- ビデオ関連テーブルの構造変更

-- 1. videosテーブルの再構築（カラム順序を正しく配置）
-- 外部キー制約を削除
ALTER TABLE video_details DROP CONSTRAINT IF EXISTS video_details_video_id_fkey;
ALTER TABLE video_tags DROP CONSTRAINT IF EXISTS video_tags_video_id_fkey;
ALTER TABLE video_video_types DROP CONSTRAINT IF EXISTS video_video_types_video_id_fkey;

-- content_detailsテーブルの削除
DROP INDEX IF EXISTS idx_content_details_description_trgm;
DROP INDEX IF EXISTS idx_content_details_video_id;
ALTER TABLE content_details DROP CONSTRAINT IF EXISTS content_details_video_id_fkey;
DROP TABLE content_details;

-- 既存のvideosテーブルのインデックスを削除
DROP INDEX IF EXISTS idx_videos_published_at;
DROP INDEX IF EXISTS idx_videos_channel_id;
DROP INDEX IF EXISTS idx_videos_title;
DROP INDEX IF EXISTS idx_videos_title_trgm;
DROP INDEX IF EXISTS idx_videos_channel_published;

-- 元のvideosテーブルを削除
DROP TABLE videos;

-- 新しい構造でvideosテーブルを再作成
CREATE TABLE videos (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    duration VARCHAR(8),
    channel_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
);

-- 2. video_detailsテーブルの再作成（published_atをvideo_idの次に配置）
-- 既存のvideo_detailsテーブルのインデックスを削除
DROP INDEX IF EXISTS idx_video_details_duration;
DROP INDEX IF EXISTS idx_video_details_video_id;

-- 元のvideo_detailsテーブルを削除
DROP TABLE video_details;

-- 新しい構造でvideo_detailsテーブルを再作成
CREATE TABLE video_details (
    video_id VARCHAR(50) PRIMARY KEY,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- 3. stream_detailsテーブルの作成
CREATE TABLE stream_details (
    video_id VARCHAR(50) PRIMARY KEY,
    started_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- 4. インデックスの追加
-- videosテーブルに新しいカラムのインデックス
CREATE INDEX idx_videos_duration ON videos(duration);
CREATE INDEX idx_videos_description_trgm ON videos USING gin (description gin_trgm_ops);

-- video_detailsテーブルの削除されたカラムのインデックスを削除
DROP INDEX IF EXISTS idx_video_details_duration;
DROP INDEX IF EXISTS idx_video_details_video_id;

-- video_detailsテーブルに新しいカラムのインデックス
CREATE INDEX idx_video_details_published_at ON video_details(published_at DESC);

-- stream_detailsテーブルのインデックス
CREATE INDEX idx_stream_details_started_at ON stream_details(started_at DESC);
