--liquibase formatted sql

--changeset shirogane:027-add-compilation-album-type
--comment: コンピレーションアルバムタイプを追加

-- コンピレーションアルバムタイプを追加
INSERT INTO album_types (type_name, description)
VALUES ('Compilation', 'Compilation album');

--rollback DELETE FROM album_types WHERE type_name = 'Compilation';