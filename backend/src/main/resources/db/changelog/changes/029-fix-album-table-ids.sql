--liquibase formatted sql

--changeset shirogane:029-fix-album-table-ids
--comment: アルバム関連テーブルのIDをUUIDに修正し、album_releasesからidカラムを削除

-- 既存のテーブル構造をバックアップ用に保存（必要に応じて）
-- データが存在する場合は事前にバックアップを推奨

-- 外部キー制約を一時的に削除
ALTER TABLE album_tracks DROP CONSTRAINT IF EXISTS album_tracks_album_id_fkey;
ALTER TABLE track_releases DROP CONSTRAINT IF EXISTS track_releases_album_track_id_fkey;
ALTER TABLE album_releases DROP CONSTRAINT IF EXISTS album_releases_album_id_fkey;

-- 既存データを削除（データの整合性を保つため）
TRUNCATE TABLE track_releases CASCADE;
TRUNCATE TABLE album_releases CASCADE;
TRUNCATE TABLE album_tracks CASCADE;
TRUNCATE TABLE albums CASCADE;

-- albums テーブルのidカラムをUUIDに変更
ALTER TABLE albums DROP CONSTRAINT albums_pkey;
ALTER TABLE albums ALTER COLUMN id TYPE UUID USING id::uuid;
ALTER TABLE albums ADD CONSTRAINT albums_pkey PRIMARY KEY (id);

-- album_tracks テーブルのidとalbum_idをUUIDに変更
ALTER TABLE album_tracks DROP CONSTRAINT album_tracks_pkey;
ALTER TABLE album_tracks ALTER COLUMN id TYPE UUID USING id::uuid;
ALTER TABLE album_tracks ALTER COLUMN album_id TYPE UUID USING album_id::uuid;
ALTER TABLE album_tracks ADD CONSTRAINT album_tracks_pkey PRIMARY KEY (id);

-- track_releases テーブルのidとalbum_track_idをUUIDに変更
ALTER TABLE track_releases DROP CONSTRAINT track_releases_pkey;
ALTER TABLE track_releases ALTER COLUMN id TYPE UUID USING id::uuid;
ALTER TABLE track_releases ALTER COLUMN album_track_id TYPE UUID USING album_track_id::uuid;
ALTER TABLE track_releases ADD CONSTRAINT track_releases_pkey PRIMARY KEY (id);

-- album_releases テーブルの修正（idカラムを削除、album_idをUUIDに変更）
ALTER TABLE album_releases DROP CONSTRAINT album_releases_pkey;
ALTER TABLE album_releases DROP COLUMN id;
ALTER TABLE album_releases ALTER COLUMN album_id TYPE UUID USING album_id::uuid;
ALTER TABLE album_releases ADD CONSTRAINT album_releases_pkey PRIMARY KEY (album_id, platform_id);

-- 外部キー制約を再作成
ALTER TABLE album_tracks
    ADD CONSTRAINT album_tracks_album_id_fkey
    FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE;

ALTER TABLE track_releases
    ADD CONSTRAINT track_releases_album_track_id_fkey
    FOREIGN KEY (album_track_id) REFERENCES album_tracks (id) ON DELETE CASCADE;

ALTER TABLE album_releases
    ADD CONSTRAINT album_releases_album_id_fkey
    FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE;

--rollback -- Note: このマイグレーションは破壊的変更のため、ロールバックには注意が必要
--rollback ALTER TABLE album_releases DROP CONSTRAINT album_releases_album_id_fkey;
--rollback ALTER TABLE track_releases DROP CONSTRAINT track_releases_album_track_id_fkey;
--rollback ALTER TABLE album_tracks DROP CONSTRAINT album_tracks_album_id_fkey;
--rollback
--rollback ALTER TABLE album_releases DROP CONSTRAINT album_releases_pkey;
--rollback ALTER TABLE album_releases ADD COLUMN id VARCHAR(255);
--rollback ALTER TABLE album_releases ALTER COLUMN album_id TYPE VARCHAR(255);
--rollback ALTER TABLE album_releases ADD CONSTRAINT album_releases_pkey PRIMARY KEY (id);
--rollback
--rollback ALTER TABLE track_releases DROP CONSTRAINT track_releases_pkey;
--rollback ALTER TABLE track_releases ALTER COLUMN id TYPE VARCHAR(255);
--rollback ALTER TABLE track_releases ALTER COLUMN album_track_id TYPE VARCHAR(255);
--rollback ALTER TABLE track_releases ADD CONSTRAINT track_releases_pkey PRIMARY KEY (id);
--rollback
--rollback ALTER TABLE album_tracks DROP CONSTRAINT album_tracks_pkey;
--rollback ALTER TABLE album_tracks ALTER COLUMN id TYPE VARCHAR(255);
--rollback ALTER TABLE album_tracks ALTER COLUMN album_id TYPE VARCHAR(255);
--rollback ALTER TABLE album_tracks ADD CONSTRAINT album_tracks_pkey PRIMARY KEY (id);
--rollback
--rollback ALTER TABLE albums DROP CONSTRAINT albums_pkey;
--rollback ALTER TABLE albums ALTER COLUMN id TYPE VARCHAR(255);
--rollback ALTER TABLE albums ADD CONSTRAINT albums_pkey PRIMARY KEY (id);
--rollback
--rollback -- 外部キー制約を再作成
--rollback ALTER TABLE album_tracks ADD CONSTRAINT album_tracks_album_id_fkey FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE;
--rollback ALTER TABLE track_releases ADD CONSTRAINT track_releases_album_track_id_fkey FOREIGN KEY (album_track_id) REFERENCES album_tracks (id) ON DELETE CASCADE;
--rollback ALTER TABLE album_releases ADD CONSTRAINT album_releases_album_id_fkey FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE;