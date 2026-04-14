-- ニュース機能用テーブル作成

-- ニュースカテゴリテーブル
CREATE TABLE news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,           -- GOODS, COLLABORATION, EVENT, MEDIA
    display_name VARCHAR(100) NOT NULL,         -- グッズ, コラボ, イベント, メディア
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ニュースメインテーブル
CREATE TABLE news (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    published_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES news_categories(id)
);

-- ニュース詳細テーブル
CREATE TABLE news_details (
    news_id VARCHAR(50) PRIMARY KEY,
    content TEXT NOT NULL,
    summary TEXT,                               -- 一覧表示用の要約（100文字程度）
    thumbnail_url VARCHAR(255),
    external_url VARCHAR(500),                  -- 外部リンクURL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

-- インデックス作成
CREATE INDEX idx_news_categories_name ON news_categories(name);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category_id ON news(category_id);
CREATE INDEX idx_news_category_published ON news(category_id, published_at DESC);
CREATE INDEX idx_news_title ON news(title);

-- 初期カテゴリデータ投入
INSERT INTO news_categories (name, display_name, description, sort_order) VALUES
('GOODS', 'グッズ', '新商品発表、グッズ販売開始/終了、限定商品情報', 1),
('COLLABORATION', 'コラボ', '企業コラボ、他VTuberとのコラボ、案件配信情報', 2),
('EVENT', 'イベント', 'リアルイベント、オンラインイベント、記念配信', 3),
('MEDIA', 'メディア', '雑誌掲載、テレビ出演、外部メディア情報', 4);