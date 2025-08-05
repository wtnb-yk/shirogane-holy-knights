--liquibase formatted sql

--changeset shirogane:008-rename-tag-tables-step1
--comment: Step1: Rename video_tags table to video_video_tags to avoid naming conflict

-- Step1: video_tags テーブルを video_video_tags にリネーム
ALTER TABLE video_tags RENAME TO video_video_tags;

-- インデックス名を更新
ALTER INDEX archive_tags_pkey RENAME TO video_video_tags_pkey;
ALTER INDEX idx_video_tags_composite RENAME TO idx_video_video_tags_composite;
ALTER INDEX idx_video_tags_tag_id RENAME TO idx_video_video_tags_tag_id;
ALTER INDEX idx_video_tags_video_id RENAME TO idx_video_video_tags_video_id;

-- 外部キー制約名を更新
ALTER TABLE video_video_tags RENAME CONSTRAINT archive_tags_tag_id_fkey TO video_video_tags_tag_id_fkey;
ALTER TABLE video_video_tags RENAME CONSTRAINT video_tags_tag_id_fkey TO video_video_tags_tag_id_fkey_backup;

--changeset shirogane:008-rename-tag-tables-step2
--comment: Step2: Rename tags table to video_tags

-- Step2: tags テーブルを video_tags にリネーム
ALTER TABLE tags RENAME TO video_tags;

-- シーケンス名を更新
ALTER SEQUENCE tags_id_seq RENAME TO video_tags_id_seq;

-- インデックス名を更新
ALTER INDEX tags_pkey RENAME TO video_tags_pkey;
ALTER INDEX idx_tags_name RENAME TO idx_video_tags_name;
ALTER INDEX tags_name_key RENAME TO video_tags_name_key;

-- 外部キー制約の参照先を更新（video_video_tagsテーブルから）
ALTER TABLE video_video_tags DROP CONSTRAINT video_video_tags_tag_id_fkey;
ALTER TABLE video_video_tags DROP CONSTRAINT video_video_tags_tag_id_fkey_backup;
ALTER TABLE video_video_tags ADD CONSTRAINT video_video_tags_tag_id_fkey 
    FOREIGN KEY (tag_id) REFERENCES video_tags(id) ON DELETE CASCADE;