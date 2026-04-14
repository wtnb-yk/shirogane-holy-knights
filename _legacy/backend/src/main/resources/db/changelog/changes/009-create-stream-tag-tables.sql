--liquibase formatted sql

--changeset shirogane:009-create-stream-tags-table
--comment: Create stream_tags table for stream-specific tags

-- 配信用タグマスターテーブル作成
CREATE TABLE stream_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_stream_tags_name ON stream_tags(name);

--changeset shirogane:009-create-video-stream-tags-table
--comment: Create video_stream_tags table for stream-tag relationships

-- 配信とタグの中間テーブル作成
CREATE TABLE video_stream_tags (
    video_id VARCHAR(50) NOT NULL,
    tag_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (video_id, tag_id)
);

-- 外部キー制約
ALTER TABLE video_stream_tags 
    ADD CONSTRAINT video_stream_tags_video_id_fkey 
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

ALTER TABLE video_stream_tags 
    ADD CONSTRAINT video_stream_tags_tag_id_fkey 
    FOREIGN KEY (tag_id) REFERENCES stream_tags(id) ON DELETE CASCADE;

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_video_stream_tags_video_id ON video_stream_tags(video_id);
CREATE INDEX idx_video_stream_tags_tag_id ON video_stream_tags(tag_id);
CREATE INDEX idx_video_stream_tags_composite ON video_stream_tags(video_id, tag_id);