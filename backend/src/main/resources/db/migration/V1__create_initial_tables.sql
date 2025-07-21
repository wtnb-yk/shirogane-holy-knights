-- アーカイブテーブル
CREATE TABLE IF NOT EXISTS archives (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    published_at TIMESTAMP NOT NULL,
    description TEXT,
    duration VARCHAR(8),  -- HH:MM:SS形式
    thumbnail_url VARCHAR(255)
);

-- タグテーブル
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- アーカイブとタグの関連テーブル
CREATE TABLE IF NOT EXISTS archive_tags (
    archive_id VARCHAR(50) NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (archive_id, tag_id),
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- インデックス作成
CREATE INDEX idx_archives_published_at ON archives(published_at);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_archive_tags_archive_id ON archive_tags(archive_id);
CREATE INDEX idx_archive_tags_tag_id ON archive_tags(tag_id);