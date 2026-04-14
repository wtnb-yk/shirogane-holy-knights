--liquibase formatted sql

--changeset shirogane:010-restructure-news-tables
--comment: News関連テーブルの再構築 - news_detailsテーブルを削除し、newsテーブルに統合

-- 1. news_detailsテーブルの削除
DROP TABLE IF EXISTS news_details CASCADE;

-- 2. newsテーブルの削除
DROP TABLE IF EXISTS news CASCADE;

-- 3. news_categoriesテーブルのカラム削除
ALTER TABLE news_categories DROP COLUMN IF EXISTS display_name;
ALTER TABLE news_categories DROP COLUMN IF EXISTS description;

-- 4. newsテーブルの再作成（content, thumbnail_url, external_urlカラムを含む）
CREATE TABLE news (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(255),
    external_url VARCHAR(500),
    published_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES news_categories(id)
);

-- 5. インデックスの作成
CREATE INDEX idx_news_category_id ON news(category_id);
CREATE INDEX idx_news_category_published ON news(category_id, published_at DESC);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_title ON news(title);

--rollback CREATE TABLE news_details (news_id VARCHAR(50) PRIMARY KEY, content TEXT NOT NULL, summary TEXT, thumbnail_url VARCHAR(255), external_url VARCHAR(500), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE);
--rollback ALTER TABLE news_categories ADD COLUMN display_name VARCHAR(100) NOT NULL DEFAULT '';
--rollback ALTER TABLE news_categories ADD COLUMN description TEXT;
--rollback DROP TABLE IF EXISTS news CASCADE;
--rollback CREATE TABLE news (id VARCHAR(50) PRIMARY KEY, title VARCHAR(255) NOT NULL, category_id INTEGER NOT NULL, published_at TIMESTAMP NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (category_id) REFERENCES news_categories(id));
--rollback CREATE INDEX idx_news_category_id ON news(category_id);
--rollback CREATE INDEX idx_news_category_published ON news(category_id, published_at DESC);
--rollback CREATE INDEX idx_news_published_at ON news(published_at DESC);
--rollback CREATE INDEX idx_news_title ON news(title);