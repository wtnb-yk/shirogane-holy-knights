-- archive → video への命名変更マイグレーション

-- 1. 外部キー制約を削除
ALTER TABLE video_details DROP CONSTRAINT video_details_archive_id_fkey;
ALTER TABLE content_details DROP CONSTRAINT content_details_archive_id_fkey;
ALTER TABLE archive_tags DROP CONSTRAINT archive_tags_archive_id_fkey;

-- 2. インデックスを削除
DROP INDEX IF EXISTS idx_archives_published_at;
DROP INDEX IF EXISTS idx_archives_channel_id;
DROP INDEX IF EXISTS idx_archives_title;
DROP INDEX IF EXISTS idx_archive_tags_archive_id;
DROP INDEX IF EXISTS idx_archive_tags_tag_id;

-- 3. テーブル名を変更
ALTER TABLE archives RENAME TO videos;
ALTER TABLE archive_tags RENAME TO video_tags;

-- 4. カラム名を変更
ALTER TABLE video_details RENAME COLUMN archive_id TO video_id;
ALTER TABLE content_details RENAME COLUMN archive_id TO video_id;
ALTER TABLE video_tags RENAME COLUMN archive_id TO video_id;

-- 5. インデックスを再作成
CREATE INDEX idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX idx_videos_channel_id ON videos(channel_id);
CREATE INDEX idx_videos_title ON videos(title);
CREATE INDEX idx_video_tags_video_id ON video_tags(video_id);
CREATE INDEX idx_video_tags_tag_id ON video_tags(tag_id);

-- 6. 外部キー制約を再作成
ALTER TABLE video_details 
    ADD CONSTRAINT video_details_video_id_fkey 
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

ALTER TABLE content_details 
    ADD CONSTRAINT content_details_video_id_fkey 
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

ALTER TABLE video_tags 
    ADD CONSTRAINT video_tags_video_id_fkey 
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

ALTER TABLE video_tags 
    ADD CONSTRAINT video_tags_tag_id_fkey 
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;