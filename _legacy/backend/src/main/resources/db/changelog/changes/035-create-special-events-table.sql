--liquibase formatted sql

--changeset shirogane:035-create-special-events-table
--comment: Create special_events table for managing special events and campaigns

-- スペシャルイベントテーブル作成
CREATE TABLE special_events (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_special_events_start_date ON special_events(start_date);
CREATE INDEX idx_special_events_end_date ON special_events(end_date);
CREATE INDEX idx_special_events_title ON special_events(title);
CREATE INDEX idx_special_events_date_range ON special_events(start_date, end_date);

-- 制約: 終了日は開始日より後でなければならない
ALTER TABLE special_events 
    ADD CONSTRAINT chk_special_events_date_range 
    CHECK (end_date > start_date);

--rollback DROP INDEX IF EXISTS idx_special_events_date_range;
--rollback DROP INDEX IF EXISTS idx_special_events_title;
--rollback DROP INDEX IF EXISTS idx_special_events_end_date;
--rollback DROP INDEX IF EXISTS idx_special_events_start_date;
--rollback DROP TABLE IF EXISTS special_events;
