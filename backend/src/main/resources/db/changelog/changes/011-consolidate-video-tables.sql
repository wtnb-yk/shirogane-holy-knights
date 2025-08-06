--liquibase formatted sql

--changeset shirogane:011-consolidate-video-tables
--comment: video_detailsテーブルを削除し、published_atカラムをvideosテーブルに統合

-- 1. 依存関係の削除
-- stream_detailsの外部キー制約を一時的に削除
ALTER TABLE stream_details DROP CONSTRAINT IF EXISTS stream_details_video_id_fkey;

-- video_video_typesの外部キー制約を一時的に削除
ALTER TABLE video_video_types DROP CONSTRAINT IF EXISTS video_video_types_video_id_fkey;

-- video_video_tagsの外部キー制約を一時的に削除
ALTER TABLE video_video_tags DROP CONSTRAINT IF EXISTS video_video_tags_video_id_fkey;

-- video_stream_tagsの外部キー制約を一時的に削除
ALTER TABLE video_stream_tags DROP CONSTRAINT IF EXISTS video_stream_tags_video_id_fkey;

-- 2. video_detailsテーブルの削除
DROP INDEX IF EXISTS idx_video_details_published_at;
DROP TABLE IF EXISTS video_details CASCADE;

-- 3. videosテーブルの再作成（published_atカラムを含む）
-- 既存のインデックスを削除
DROP INDEX IF EXISTS idx_videos_description_trgm;
DROP INDEX IF EXISTS idx_videos_duration;

-- 既存のvideosテーブルを削除
DROP TABLE IF EXISTS videos CASCADE;

-- 新しい構造でvideosテーブルを再作成
CREATE TABLE videos (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    duration VARCHAR(8),
    channel_id VARCHAR(50) NOT NULL,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
);

-- 4. インデックスの再作成
CREATE INDEX idx_videos_description_trgm ON videos USING gin (description gin_trgm_ops);
CREATE INDEX idx_videos_duration ON videos(duration);
CREATE INDEX idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX idx_videos_channel_id ON videos(channel_id);
CREATE INDEX idx_videos_title ON videos(title);

-- 5. 外部キー制約の再設定
ALTER TABLE stream_details 
    ADD CONSTRAINT stream_details_video_id_fkey 
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

ALTER TABLE video_video_types 
    ADD CONSTRAINT video_video_types_video_id_fkey 
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

ALTER TABLE video_video_tags 
    ADD CONSTRAINT video_video_tags_video_id_fkey 
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

ALTER TABLE video_stream_tags 
    ADD CONSTRAINT video_stream_tags_video_id_fkey 
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

--rollback ALTER TABLE stream_details DROP CONSTRAINT IF EXISTS stream_details_video_id_fkey;
--rollback ALTER TABLE video_video_types DROP CONSTRAINT IF EXISTS video_video_types_video_id_fkey;
--rollback ALTER TABLE video_video_tags DROP CONSTRAINT IF EXISTS video_video_tags_video_id_fkey;
--rollback ALTER TABLE video_stream_tags DROP CONSTRAINT IF EXISTS video_stream_tags_video_id_fkey;
--rollback DROP INDEX IF EXISTS idx_videos_description_trgm;
--rollback DROP INDEX IF EXISTS idx_videos_duration;
--rollback DROP INDEX IF EXISTS idx_videos_published_at;
--rollback DROP INDEX IF EXISTS idx_videos_channel_id;
--rollback DROP INDEX IF EXISTS idx_videos_title;
--rollback DROP TABLE IF EXISTS videos CASCADE;
--rollback CREATE TABLE videos (id VARCHAR(50) PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, url VARCHAR(255), thumbnail_url VARCHAR(255), duration VARCHAR(8), channel_id VARCHAR(50) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE);
--rollback CREATE INDEX idx_videos_description_trgm ON videos USING gin (description gin_trgm_ops);
--rollback CREATE INDEX idx_videos_duration ON videos(duration);
--rollback CREATE TABLE video_details (video_id VARCHAR(50) PRIMARY KEY, published_at TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE);
--rollback CREATE INDEX idx_video_details_published_at ON video_details(published_at DESC);
--rollback ALTER TABLE stream_details ADD CONSTRAINT stream_details_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;
--rollback ALTER TABLE video_video_types ADD CONSTRAINT video_video_types_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;
--rollback ALTER TABLE video_video_tags ADD CONSTRAINT video_video_tags_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;
--rollback ALTER TABLE video_stream_tags ADD CONSTRAINT video_stream_tags_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;