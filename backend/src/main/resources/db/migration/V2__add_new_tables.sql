-- 新しいテーブル構造を追加

-- チャンネルテーブル
CREATE TABLE channels (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    handle VARCHAR(100),
    description TEXT,
    subscriber_count INTEGER,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 動画詳細テーブル
CREATE TABLE video_details (
    archive_id VARCHAR(50) PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    duration VARCHAR(8),  -- HH:MM:SS形式
    thumbnail_url VARCHAR(255),
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE
);

-- コンテンツ詳細テーブル
CREATE TABLE content_details (
    archive_id VARCHAR(50) PRIMARY KEY,
    description TEXT,
    is_members_only BOOLEAN DEFAULT FALSE,
    is_premiered BOOLEAN DEFAULT FALSE,
    is_live_content BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE
);

-- archivesテーブルにchannel_idカラムを追加
ALTER TABLE archives 
ADD COLUMN channel_id VARCHAR(50),
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 外部キー制約を追加
ALTER TABLE archives 
ADD CONSTRAINT fk_archives_channel_id 
FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE;

-- インデックス作成
CREATE INDEX idx_archives_channel_id ON archives(channel_id);
CREATE INDEX idx_archives_title ON archives(title);

CREATE INDEX idx_video_details_duration ON video_details(duration);
CREATE INDEX idx_video_details_view_count ON video_details(view_count DESC);

CREATE INDEX idx_content_details_members_only ON content_details(is_members_only);
CREATE INDEX idx_content_details_live_content ON content_details(is_live_content);

CREATE INDEX idx_channels_title ON channels(title);
CREATE INDEX idx_channels_handle ON channels(handle);