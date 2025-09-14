--liquibase formatted sql

--changeset shirogane:020-add-song-query-indexes
--comment: 楽曲検索クエリの性能改善用インデックス追加

-- stream_detailsテーブルのJOIN最適化用インデックス
CREATE INDEX IF NOT EXISTS idx_stream_details_video_id
ON stream_details(video_id);

-- stream_detailsテーブルのMAX(started_at)とORDER BY最適化用インデックス
CREATE INDEX IF NOT EXISTS idx_stream_details_started_at_desc
ON stream_details(started_at DESC);

-- 統計情報の更新（クエリプランナーが最適な実行計画を選択できるように）
ANALYZE stream_details;
ANALYZE stream_songs;
ANALYZE songs;

--rollback DROP INDEX IF EXISTS idx_stream_details_started_at_desc;
--rollback DROP INDEX IF EXISTS idx_stream_details_video_id;