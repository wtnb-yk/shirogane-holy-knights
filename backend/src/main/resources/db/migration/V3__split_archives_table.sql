-- テーブル分割のためのマイグレーションスクリプト

-- 1. 新しいテーブルを作成

-- video_details テーブル作成
CREATE TABLE IF NOT EXISTS video_details (
    archive_id VARCHAR(50) PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    duration VARCHAR(8),  -- HH:MM:SS形式
    thumbnail_url VARCHAR(255),
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE
);

-- content_details テーブル作成
CREATE TABLE IF NOT EXISTS content_details (
    archive_id VARCHAR(50) PRIMARY KEY,
    description TEXT,
    is_members_only BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE
);

-- 2. 既存データを初期化（一旦削除）
DELETE FROM archive_tags;
DELETE FROM archives;
DELETE FROM tags WHERE id > 0;

-- 3. 必要なインデックスを作成
CREATE INDEX idx_video_details_archive_id ON video_details(archive_id);
CREATE INDEX idx_content_details_archive_id ON content_details(archive_id);
CREATE INDEX idx_content_details_members_only ON content_details(is_members_only);

-- 4. archivesテーブルから不要なカラムを削除
ALTER TABLE archives
DROP COLUMN url,
DROP COLUMN description,
DROP COLUMN duration,
DROP COLUMN thumbnail_url;