--liquibase formatted sql

--changeset shirogane:031-add-vrchat-stream-tag
--comment: Add VRChat tag to stream_tags table

INSERT INTO public.stream_tags (id, name, description)
VALUES (17, 'VRChat', 'VRChat')
ON CONFLICT (name) DO NOTHING;

--rollback DELETE FROM stream_tags WHERE name = 'VRChat';