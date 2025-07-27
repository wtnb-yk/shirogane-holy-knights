-- チャンネル情報を追加するマイグレーション

-- チャンネルテーブルを作成
CREATE TABLE IF NOT EXISTS channels (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

-- チャンネル詳細テーブルを作成
CREATE TABLE IF NOT EXISTS channel_details (
    channel_id VARCHAR(50) PRIMARY KEY,
    handle VARCHAR(100),
    description TEXT,
    subscriber_count INTEGER,
    icon_url VARCHAR(255)
);

-- archivesテーブルにchannel_idカラムを追加
ALTER TABLE archives 
ADD COLUMN channel_id VARCHAR(50) NOT NULL;
