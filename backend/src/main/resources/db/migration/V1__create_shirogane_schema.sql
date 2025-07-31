-- 白銀ノエル団員ポータル用データベーススキーマ作成

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

-- アーカイブテーブル（メイン情報のみ）
CREATE TABLE archives (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    channel_id VARCHAR(50) NOT NULL,
    published_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
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

-- タグテーブル
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- HEXカラーコード
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- アーカイブとタグの関連テーブル
CREATE TABLE archive_tags (
    archive_id VARCHAR(50) NOT NULL,
    tag_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (archive_id, tag_id),
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- インデックス作成
CREATE INDEX idx_archives_published_at ON archives(published_at DESC);
CREATE INDEX idx_archives_channel_id ON archives(channel_id);
CREATE INDEX idx_archives_title ON archives(title);

CREATE INDEX idx_video_details_duration ON video_details(duration);
CREATE INDEX idx_video_details_view_count ON video_details(view_count DESC);

CREATE INDEX idx_content_details_members_only ON content_details(is_members_only);
CREATE INDEX idx_content_details_live_content ON content_details(is_live_content);

CREATE INDEX idx_tags_name ON tags(name);

CREATE INDEX idx_archive_tags_archive_id ON archive_tags(archive_id);
CREATE INDEX idx_archive_tags_tag_id ON archive_tags(tag_id);

CREATE INDEX idx_channels_title ON channels(title);
CREATE INDEX idx_channels_handle ON channels(handle);