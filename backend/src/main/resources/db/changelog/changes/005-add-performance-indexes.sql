-- パフォーマンス最適化のためのインデックス追加

-- 1. 全文検索用GINインデックス（タイトル検索の高速化）
-- 日本語と英語の両方に対応するため、to_tsvectorは使用せず、pg_trgmを使用
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- タイトルの部分一致検索用トライグラムインデックス
CREATE INDEX IF NOT EXISTS idx_videos_title_trgm
ON videos USING gin(title gin_trgm_ops);

-- 説明文の部分一致検索用トライグラムインデックス（content_detailsテーブル）
CREATE INDEX IF NOT EXISTS idx_content_details_description_trgm
ON content_details USING gin(description gin_trgm_ops);

-- 2. 複合インデックス（頻繁なクエリパターンに対応）
-- チャンネルと公開日での複合検索用（既存のidx_videos_channel_idとidx_videos_published_atを統合）
CREATE INDEX IF NOT EXISTS idx_videos_channel_published
ON videos (channel_id, published_at DESC);

-- 3. JOIN最適化用インデックス（外部キーカラム）
-- video_detailsのvideo_id（JOINで頻繁に使用）
CREATE INDEX IF NOT EXISTS idx_video_details_video_id
ON video_details (video_id);

-- content_detailsのvideo_id（JOINで頻繁に使用）
CREATE INDEX IF NOT EXISTS idx_content_details_video_id
ON content_details (video_id);

-- video_tagsの複合インデックス（video_idとtag_idの組み合わせ）
CREATE INDEX IF NOT EXISTS idx_video_tags_composite
ON video_tags (video_id, tag_id);

-- 4. タグ検索最適化
-- tagsテーブルのname（タグ名での検索）- 既存のidx_tags_nameがあるためスキップ

-- 5. 統計情報の更新（インデックス作成後にクエリプランナーが最適な実行計画を選択できるように）
ANALYZE videos;
ANALYZE video_details;
ANALYZE content_details;
ANALYZE video_tags;
ANALYZE tags;
