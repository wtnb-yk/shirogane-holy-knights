--liquibase formatted sql

--changeset shirogane:026-insert-initial-album-types
--comment: アルバムタイプの初期データを挿入

-- アルバムタイプの初期データ挿入
INSERT INTO album_types (type_name, description)
VALUES
    ('Album', 'Full-length album'),
    ('Single', 'Single release'),
    ('EP', 'Extended Play');

--rollback DELETE FROM album_types WHERE type_name IN ('Album', 'Single', 'EP');