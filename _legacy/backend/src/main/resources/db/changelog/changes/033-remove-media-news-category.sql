--liquibase formatted sql

--changeset shirogane:033-remove-media-news-category
--comment: Remove media category from news_categories table as it is not used

-- mediaカテゴリをnews_categoriesテーブルから削除
DELETE FROM news_categories WHERE name = 'media';

--rollback INSERT INTO news_categories (name, sort_order) VALUES ('media', 4);
