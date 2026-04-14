--liquibase formatted sql

--changeset shirogane:013-insert-initial-news-categories
-- news_categoriesテーブルに初期データを挿入
INSERT INTO news_categories (name, sort_order) VALUES
    ('campaign', 5),
    ('others', 6)
ON CONFLICT (name) DO NOTHING;

--rollback DELETE FROM news_categories WHERE name IN ('キャンペーン', 'その他');

-- 日本語名を英語に更新
UPDATE news_categories SET name = 'goods' WHERE name = 'グッズ';
UPDATE news_categories SET name = 'collaboration' WHERE name = 'コラボ';
UPDATE news_categories SET name = 'event' WHERE name = 'イベント';
UPDATE news_categories SET name = 'media' WHERE name = 'メディア';
