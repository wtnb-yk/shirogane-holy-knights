--liquibase formatted sql

--changeset shirogane:023-change-events-id-to-varchar
--comment: Change events table id from BIGINT to VARCHAR(50) to match news table format

-- 外部キー制約を削除
ALTER TABLE event_event_types DROP CONSTRAINT event_event_types_event_id_fkey;

-- events テーブルのid列をVARCHAR(50)に変更
ALTER TABLE events ALTER COLUMN id TYPE VARCHAR(50);

-- event_event_types テーブルのevent_id列をVARCHAR(50)に変更
ALTER TABLE event_event_types ALTER COLUMN event_id TYPE VARCHAR(50);

-- 外部キー制約を再作成
ALTER TABLE event_event_types
    ADD CONSTRAINT event_event_types_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;