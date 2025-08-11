--liquibase formatted sql

--changeset shirogane:014-insert-initial-stream-tags
-- stream_tagsテーブルに初期データを挿入
INSERT INTO public.stream_tags (id, name, description)
VALUES (1, '雑談', '雑談'),
       (2, 'ゲーム', 'ゲーム'),
       (3, '歌枠', '歌枠'),
       (4, 'ASMR', 'ASMR'),
       (5, '企画', '企画'),
       (6, 'コラボ', 'コラボ'),
       (7, '3D', '3D'),
       (8, '記念', '記念'),
       (9, '同時視聴', '同時視聴'),
       (10, '耐久', '耐久'),
       (11, '案件', '案件'),
       (12, '参加型', '参加型'),
       (13, '新衣装', '新衣装'),
       (14, 'ライブ', 'ライブ'),
       (15, '英語勉強', '英語勉強'),
       (16, 'カード開封', 'カード開封')
    ON CONFLICT (name) DO NOTHING;

--rollback DELETE FROM stream_tags WHERE name IN ();
