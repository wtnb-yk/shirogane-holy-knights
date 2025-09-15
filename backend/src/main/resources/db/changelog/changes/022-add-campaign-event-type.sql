--liquibase formatted sql

--changeset shirogane:022-add-campaign-event-type
--comment: Add campaign event type to event_types table

-- キャンペーンタイプを追加
INSERT INTO event_types (type) VALUES ('campaign');