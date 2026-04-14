--liquibase formatted sql

--changeset shirogane:011-news-multiple-categories
--comment: ニュースの複数カテゴリ対応 - category_idを削除し、中間テーブルnews_news_categoriesを作成

-- 1. news_news_categoriesテーブルを作成（多対多の中間テーブル）
CREATE TABLE news_news_categories (
    news_id VARCHAR(50) NOT NULL,
    news_category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (news_id, news_category_id),
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    FOREIGN KEY (news_category_id) REFERENCES news_categories(id) ON DELETE RESTRICT
);

-- 2. インデックスを作成
CREATE INDEX idx_news_news_categories_news_id ON news_news_categories(news_id);
CREATE INDEX idx_news_news_categories_category_id ON news_news_categories(news_category_id);
CREATE INDEX idx_news_news_categories_composite ON news_news_categories(news_id, news_category_id);

-- 3. 既存データを中間テーブルに移行
INSERT INTO news_news_categories (news_id, news_category_id)
SELECT id, category_id FROM news;

-- 4. news.category_idカラムを削除
ALTER TABLE news DROP COLUMN category_id;

--rollback ALTER TABLE news ADD COLUMN category_id INTEGER;
--rollback UPDATE news SET category_id = (SELECT news_category_id FROM news_news_categories WHERE news_id = news.id LIMIT 1);
--rollback ALTER TABLE news ALTER COLUMN category_id SET NOT NULL;
--rollback ALTER TABLE news ADD FOREIGN KEY (category_id) REFERENCES news_categories(id);
--rollback DROP TABLE IF EXISTS news_news_categories;