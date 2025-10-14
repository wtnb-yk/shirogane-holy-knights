--liquibase formatted sql

--changeset shirogane:032-add-collaboration-event-type
--comment: Add collaboration event type to event_types table

-- コラボレーションタイプを追加
INSERT INTO event_types (type) VALUES ('collaboration');