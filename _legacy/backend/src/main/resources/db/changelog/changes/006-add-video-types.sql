-- 動画種類マスタテーブル
CREATE TABLE video_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL UNIQUE  -- 'stream', 'video'
);

-- 動画と種類の関連テーブル
CREATE TABLE video_video_types (
    video_id VARCHAR(50) NOT NULL,
    video_type_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (video_id, video_type_id),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (video_type_id) REFERENCES video_types(id) ON DELETE RESTRICT
);

-- インデックス作成
CREATE INDEX idx_video_types_type ON video_types(type);
CREATE INDEX idx_video_video_types_video_id ON video_video_types(video_id);
CREATE INDEX idx_video_video_types_type_id ON video_video_types(video_type_id);

-- 初期データ投入
INSERT INTO video_types (type) VALUES
    ('stream'),
    ('video');
