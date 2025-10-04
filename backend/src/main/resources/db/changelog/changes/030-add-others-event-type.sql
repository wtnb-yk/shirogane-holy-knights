--liquibase formatted sql

--changeset shirogane:030-add-others-event-type
--comment: Add others event type to event_types table

-- その他タイプを追加
INSERT INTO event_types (type) VALUES ('others');
