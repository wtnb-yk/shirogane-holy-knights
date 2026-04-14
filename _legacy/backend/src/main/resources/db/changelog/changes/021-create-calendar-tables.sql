--liquibase formatted sql

--changeset shirogane:021-create-event-types-table
--comment: Create event_types table for calendar event type master data

-- イベントタイプマスタテーブル作成
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL UNIQUE
);

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_event_types_type ON event_types(type);

-- 初期データ投入
INSERT INTO event_types (type) VALUES
    ('event'),
    ('goods');

--changeset shirogane:021-create-events-table
--comment: Create events table for calendar events

-- カレンダーイベントテーブル作成
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    end_date DATE,
    end_time TIME,
    url VARCHAR(500),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_title ON events(title);

--changeset shirogane:021-create-event-event-types-table
--comment: Create event_event_types table for event-eventtype relationships

-- イベントとイベントタイプの中間テーブル作成
CREATE TABLE event_event_types (
    event_id BIGINT NOT NULL,
    event_type_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, event_type_id)
);

-- 外部キー制約
ALTER TABLE event_event_types
    ADD CONSTRAINT event_event_types_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE event_event_types
    ADD CONSTRAINT event_event_types_event_type_id_fkey
    FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE RESTRICT;

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_event_event_types_event_id ON event_event_types(event_id);
CREATE INDEX idx_event_event_types_event_type_id ON event_event_types(event_type_id);
CREATE INDEX idx_event_event_types_composite ON event_event_types(event_id, event_type_id);