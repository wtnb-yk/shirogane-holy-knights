--liquibase formatted sql

--changeset shirogane:024-optimize-query-performance
--comment: データベースクエリパフォーマンス最適化のためのインデックス追加と改善

-- 1. 動画検索の複合インデックス最適化
-- チャンネル + 公開日の複合検索（最も頻繁なパターン）
CREATE INDEX IF NOT EXISTS idx_videos_channel_published_composite 
ON videos (channel_id, published_at DESC);

-- チャンネル + 公開日 + タイトル検索の複合インデックス
CREATE INDEX IF NOT EXISTS idx_videos_channel_published_title 
ON videos (channel_id, published_at DESC, title);

-- 2. タグフィルタリング最適化用カバリングインデックス
-- 動画タグ関係のカバリングインデックス（JOINパフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_video_tags_covering 
ON video_video_tags (tag_id, video_id) 
INCLUDE (created_at);

-- 配信タグ関係のカバリングインデックス
CREATE INDEX IF NOT EXISTS idx_stream_tags_covering 
ON video_stream_tags (tag_id, video_id) 
INCLUDE (created_at);

-- 3. ニュース検索最適化
-- カテゴリ + 公開日 + タイトルの複合インデックス
CREATE INDEX IF NOT EXISTS idx_news_category_published_title 
ON news (published_at DESC, title) 
WHERE published_at IS NOT NULL;

-- ニュース-カテゴリ関係の最適化（既存のcompositeインデックスを拡張）
CREATE INDEX IF NOT EXISTS idx_news_categories_published 
ON news_news_categories (news_category_id, news_id);

-- 4. 楽曲検索最適化
-- 配信楽曲の複合インデックス（歌唱回数計算用）
CREATE INDEX IF NOT EXISTS idx_stream_songs_song_video 
ON stream_songs (song_id, video_id) 
INCLUDE (start_seconds, created_at);

-- コンサート楽曲の複合インデックス
CREATE INDEX IF NOT EXISTS idx_concert_songs_song_video 
ON concert_songs (song_id, video_id) 
INCLUDE (start_seconds, created_at);

-- 楽曲タイトル・アーティスト検索用トライグラムインデックス
CREATE INDEX IF NOT EXISTS idx_songs_title_trgm 
ON songs USING gin(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_songs_artist_trgm 
ON songs USING gin(artist gin_trgm_ops);

-- 5. パーシャルインデックス（条件付きインデックス）
-- 公開済み動画のみのインデックス
CREATE INDEX IF NOT EXISTS idx_videos_published_only 
ON videos (published_at DESC, channel_id) 
WHERE published_at IS NOT NULL;

-- 注意: PostgreSQLのパーシャルインデックスではサブクエリが使用できないため、
-- 非表示配信のフィルタリングはアプリケーションレベルで行う

-- 6. 動画タイプ関係の最適化
-- 動画タイプフィルタリング用複合インデックス
CREATE INDEX IF NOT EXISTS idx_video_types_composite 
ON video_video_types (video_type_id, video_id);

-- 7. 非表示配信フィルタリング最適化
-- hidden_streamsテーブルの検索最適化（既存のidx_hidden_streams_video_idがあるが、念のため確認）
CREATE INDEX IF NOT EXISTS idx_hidden_streams_video_id_optimized 
ON hidden_streams (video_id) 
WHERE video_id IS NOT NULL;

-- 8. 統計情報の更新（インデックス作成後にクエリプランナーが最適な実行計画を選択できるように）
ANALYZE videos;
ANALYZE video_video_tags;
ANALYZE video_stream_tags;
ANALYZE stream_songs;
ANALYZE concert_songs;
ANALYZE news;
ANALYZE news_news_categories;
ANALYZE songs;

--rollback DROP INDEX IF EXISTS idx_songs_artist_trgm;
--rollback DROP INDEX IF EXISTS idx_songs_title_trgm;
--rollback DROP INDEX IF EXISTS idx_concert_songs_song_video;
--rollback DROP INDEX IF EXISTS idx_stream_songs_song_video;
--rollback DROP INDEX IF EXISTS idx_news_categories_published;
--rollback DROP INDEX IF EXISTS idx_news_category_published_title;
--rollback DROP INDEX IF EXISTS idx_stream_tags_covering;
--rollback DROP INDEX IF EXISTS idx_video_tags_covering;
--rollback DROP INDEX IF EXISTS idx_videos_channel_published_title;
--rollback DROP INDEX IF EXISTS idx_videos_channel_published_composite;
--rollback DROP INDEX IF EXISTS idx_videos_published_only;
--rollback DROP INDEX IF EXISTS idx_video_types_composite;
--rollback DROP INDEX IF EXISTS idx_hidden_streams_video_id_optimized;