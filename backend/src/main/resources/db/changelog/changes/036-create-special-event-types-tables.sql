--liquibase formatted sql

--changeset shirogane:036-create-special-event-types-table
--comment: Create special_event_types table for special event type master data

-- スペシャルイベントタイプマスタテーブル作成
CREATE TABLE special_event_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL UNIQUE
);

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_special_event_types_type ON special_event_types(type);

-- 初期データ投入
INSERT INTO special_event_types (type) VALUES
    ('messages');

--changeset shirogane:036-create-special-event-special-event-types-table
--comment: Create special_event_special_event_types table for special event - eventtype relationships

-- スペシャルイベントとイベントタイプの中間テーブル作成
CREATE TABLE special_event_special_event_types (
    special_event_id UUID NOT NULL,
    special_event_type_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (special_event_id, special_event_type_id)
);

-- 外部キー制約
ALTER TABLE special_event_special_event_types
    ADD CONSTRAINT special_event_special_event_types_special_event_id_fkey
    FOREIGN KEY (special_event_id) REFERENCES special_events(id) ON DELETE CASCADE;

ALTER TABLE special_event_special_event_types
    ADD CONSTRAINT special_event_special_event_types_special_event_type_id_fkey
    FOREIGN KEY (special_event_type_id) REFERENCES special_event_types(id) ON DELETE RESTRICT;

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_special_event_special_event_types_special_event_id ON special_event_special_event_types(special_event_id);
CREATE INDEX idx_special_event_special_event_types_special_event_type_id ON special_event_special_event_types(special_event_type_id);
CREATE INDEX idx_special_event_special_event_types_composite ON special_event_special_event_types(special_event_id, special_event_type_id);

--changeset shirogane:036-create-messages-table
--comment: Create messages table for storing messages related to special events

-- メッセージテーブル作成
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    special_event_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 外部キー制約
ALTER TABLE messages
    ADD CONSTRAINT messages_special_event_id_fkey
    FOREIGN KEY (special_event_id) REFERENCES special_events(id) ON DELETE CASCADE;

-- パフォーマンス最適化用インデックス
CREATE INDEX idx_messages_special_event_id ON messages(special_event_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

--rollback DROP INDEX IF EXISTS idx_messages_created_at;
--rollback DROP INDEX IF EXISTS idx_messages_special_event_id;
--rollback DROP TABLE IF EXISTS messages;
--rollback DROP INDEX IF EXISTS idx_special_event_special_event_types_composite;
--rollback DROP INDEX IF EXISTS idx_special_event_special_event_types_special_event_type_id;
--rollback DROP INDEX IF EXISTS idx_special_event_special_event_types_special_event_id;
--rollback DROP TABLE IF EXISTS special_event_special_event_types;
--rollback DROP INDEX IF EXISTS idx_special_event_types_type;
--rollback DROP TABLE IF EXISTS special_event_types;
