# データベーススキーマ仕様書

## 概要

- **データベース**: PostgreSQL 14
- **データベース名**: shirogane
- **ユーザー**: postgres
- **ポート**: 5432 (ローカル開発環境)
- **総テーブル数**: 13テーブル
- **最終更新**: 2025-08-06

## テーブル一覧

| テーブル名             | 分類           | 目的                                       |
|----------------------|----------------|-------------------------------------------|
| videos               | 動画関連        | 動画のメイン情報と公開日を管理                  |
| video_types          | 動画関連        | 動画タイプマスター（stream/video）             |
| video_video_types    | 動画関連        | 動画とタイプの中間テーブル                     |
| stream_details       | 動画関連        | 配信詳細情報（配信開始時刻等）                  |
| video_tags           | タグ・分類      | 動画用タグマスター                           |
| video_video_tags     | タグ・分類      | 動画とタグの中間テーブル                      |
| stream_tags          | タグ・分類      | 配信用タグマスター                           |
| video_stream_tags    | タグ・分類      | 配信とタグの中間テーブル                      |
| channels             | チャンネル関連   | チャンネル情報                               |
| news                 | ニュース関連     | ニュース情報（コンテンツ含む統合テーブル）        |
| news_categories      | ニュース関連     | ニュースカテゴリマスター                      |
| databasechangelog    | システム        | Liquibaseマイグレーション履歴                |
| databasechangeloglock| システム        | Liquibaseマイグレーションロック               |

## テーブル詳細仕様

### 動画関連テーブル群

#### videos（動画メインテーブル）
```sql
Table "public.videos"
    Column     |            Type             | Collation | Nullable |      Default      
---------------+-----------------------------+-----------+----------+-------------------
 id            | character varying(50)       |           | not null | 
 title         | character varying(255)      |           | not null | 
 description   | text                        |           |          | 
 url           | character varying(255)      |           |          | 
 thumbnail_url | character varying(255)      |           |          | 
 duration      | character varying(8)        |           |          | 
 channel_id    | character varying(50)       |           | not null | 
 published_at  | timestamp without time zone |           |          | 
 created_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `videos_pkey` PRIMARY KEY (id)
- `idx_videos_description_trgm` GIN (description gin_trgm_ops) - 全文検索用
- `idx_videos_duration` BTREE (duration)
- `idx_videos_published_at` BTREE (published_at DESC)
- `idx_videos_channel_id` BTREE (channel_id)
- `idx_videos_title` BTREE (title)

**外部キー制約**:
- `videos_channel_id_fkey`: channel_id → channels(id) ON DELETE CASCADE

**参照先**:
- stream_details.video_id
- video_video_types.video_id
- video_video_tags.video_id
- video_stream_tags.video_id

#### video_types（動画タイプマスター）
```sql
Table "public.video_types"
 Column |         Type          | Collation | Nullable |                 Default                 
--------+-----------------------+-----------+----------+-----------------------------------------
 id     | integer               |           | not null | nextval('video_types_id_seq'::regclass)
 type   | character varying(30) |           | not null | 
```

**インデックス**:
- `video_types_pkey` PRIMARY KEY (id)
- `idx_video_types_type` BTREE (type)
- `video_types_type_key` UNIQUE CONSTRAINT (type)

**参照先**:
- video_video_types.video_type_id

**現在のデータ**:
| id | type   |
|----|--------|
| 1  | stream |
| 2  | video  |

#### video_video_types（動画タイプ中間テーブル）
```sql
Table "public.video_video_types"
    Column     |            Type             | Collation | Nullable |      Default      
---------------+-----------------------------+-----------+----------+-------------------
 video_id      | character varying(50)       |           | not null | 
 video_type_id | integer                     |           | not null | 
 created_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `video_video_types_pkey` PRIMARY KEY (video_id, video_type_id)
- `idx_video_video_types_type_id` BTREE (video_type_id)
- `idx_video_video_types_video_id` BTREE (video_id)

**外部キー制約**:
- `video_video_types_video_type_id_fkey`: video_type_id → video_types(id) ON DELETE RESTRICT

#### stream_details（配信詳細テーブル）
```sql
Table "public.stream_details"
   Column   |            Type             | Collation | Nullable |      Default      
------------+-----------------------------+-----------+----------+-------------------
 video_id   | character varying(50)       |           | not null | 
 started_at | timestamp without time zone |           |          | 
 created_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `stream_details_pkey` PRIMARY KEY (video_id)
- `idx_stream_details_started_at` BTREE (started_at DESC)

**外部キー制約**:
- `stream_details_video_id_fkey`: video_id → videos(id) ON DELETE CASCADE

### タグ・分類関連テーブル群

#### video_tags（動画用タグマスター）
```sql
Table "public.video_tags"
   Column    |            Type             | Collation | Nullable |                Default                
-------------+-----------------------------+-----------+----------+---------------------------------------
 id          | integer                     |           | not null | nextval('video_tags_id_seq'::regclass)
 name        | character varying(50)       |           | not null | 
 description | text                        |           |          | 
 created_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `video_tags_pkey` PRIMARY KEY (id)
- `idx_video_tags_name` BTREE (name)
- `video_tags_name_key` UNIQUE CONSTRAINT (name)

**参照先**:
- video_video_tags.tag_id

#### video_video_tags（動画タグ中間テーブル）
```sql
Table "public.video_video_tags"
   Column   |            Type             | Collation | Nullable |      Default      
------------+-----------------------------+-----------+----------+-------------------
 video_id   | character varying(50)       |           | not null | 
 tag_id     | integer                     |           | not null | 
 created_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `video_video_tags_pkey` PRIMARY KEY (video_id, tag_id)
- `idx_video_video_tags_composite` BTREE (video_id, tag_id)
- `idx_video_video_tags_tag_id` BTREE (tag_id)
- `idx_video_video_tags_video_id` BTREE (video_id)

**外部キー制約**:
- `video_video_tags_tag_id_fkey`: tag_id → video_tags(id) ON DELETE CASCADE

#### stream_tags（配信用タグマスター）
```sql
Table "public.stream_tags"
   Column    |            Type             | Collation | Nullable |                 Default                 
-------------+-----------------------------+-----------+----------+-----------------------------------------
 id          | integer                     |           | not null | nextval('stream_tags_id_seq'::regclass)
 name        | character varying(50)       |           | not null | 
 description | text                        |           |          | 
 created_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `stream_tags_pkey` PRIMARY KEY (id)
- `idx_stream_tags_name` BTREE (name)
- `stream_tags_name_key` UNIQUE CONSTRAINT (name)

**参照先**:
- video_stream_tags.tag_id

#### video_stream_tags（配信タグ中間テーブル）
```sql
Table "public.video_stream_tags"
   Column   |            Type             | Collation | Nullable |      Default      
------------+-----------------------------+-----------+----------+-------------------
 video_id   | character varying(50)       |           | not null | 
 tag_id     | integer                     |           | not null | 
 created_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `video_stream_tags_pkey` PRIMARY KEY (video_id, tag_id)
- `idx_video_stream_tags_composite` BTREE (video_id, tag_id)
- `idx_video_stream_tags_tag_id` BTREE (tag_id)
- `idx_video_stream_tags_video_id` BTREE (video_id)

**外部キー制約**:
- `video_stream_tags_video_id_fkey`: video_id → videos(id) ON DELETE CASCADE
- `video_stream_tags_tag_id_fkey`: tag_id → stream_tags(id) ON DELETE CASCADE

### チャンネル関連テーブル群

#### channels（チャンネル情報）
```sql
Table "public.channels"
   Column    |            Type             | Collation | Nullable |      Default      
-------------+-----------------------------+-----------+----------+-------------------
 id          | character varying(50)       |           | not null | 
 title       | character varying(255)      |           | not null | 
 handle      | character varying(100)      |           |          | 
 description | text                        |           |          | 
 icon_url    | character varying(255)      |           |          | 
 created_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `channels_pkey` PRIMARY KEY (id)
- `idx_channels_handle` BTREE (handle)
- `idx_channels_title` BTREE (title)

**参照先**:
- videos.channel_id

### ニュース関連テーブル群

#### news（ニュース統合テーブル）
```sql
Table "public.news"
    Column     |            Type             | Collation | Nullable |      Default      
---------------+-----------------------------+-----------+----------+-------------------
 id            | character varying(50)       |           | not null | 
 title         | character varying(255)      |           | not null | 
 category_id   | integer                     |           | not null | 
 content       | text                        |           | not null | 
 thumbnail_url | character varying(255)      |           |          | 
 external_url  | character varying(500)      |           |          | 
 published_at  | timestamp without time zone |           | not null | 
 created_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `news_pkey` PRIMARY KEY (id)
- `idx_news_category_id` BTREE (category_id)
- `idx_news_category_published` BTREE (category_id, published_at DESC)
- `idx_news_published_at` BTREE (published_at DESC)
- `idx_news_title` BTREE (title)

**外部キー制約**:
- `news_category_id_fkey`: category_id → news_categories(id)

#### news_categories（ニュースカテゴリマスター）
```sql
Table "public.news_categories"
   Column   |            Type             | Collation | Nullable |                   Default                   
------------+-----------------------------+-----------+----------+---------------------------------------------
 id         | integer                     |           | not null | nextval('news_categories_id_seq'::regclass)
 name       | character varying(50)       |           | not null | 
 sort_order | integer                     |           |          | 0
 created_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP
```

**インデックス**:
- `news_categories_pkey` PRIMARY KEY (id)
- `idx_news_categories_name` BTREE (name)
- `news_categories_name_key` UNIQUE CONSTRAINT (name)

**参照先**:
- news.category_id

**現在のデータ**:
| id | name          | display_name | description                          | sort_order |
|----|---------------|--------------|--------------------------------------|------------|
| 1  | GOODS         | グッズ       | 新商品発表、グッズ販売開始/終了、限定商品情報 | 1          |
| 2  | COLLABORATION | コラボ       | 企業コラボ、他VTuberとのコラボ、案件配信情報  | 2          |
| 3  | EVENT         | イベント     | リアルイベント、オンラインイベント、記念配信  | 3          |
| 4  | MEDIA         | メディア     | 雑誌掲載、テレビ出演、外部メディア情報        | 4          |

## テーブル関係図

### 動画関連の関係性
```
channels (1) ──→ (N) videos
                    │
                    ├──→ (1) stream_details
                    │
                    ├──→ (N) video_video_types (N) ──→ (1) video_types
                    │
                    ├──→ (N) video_video_tags (N) ──→ (1) video_tags
                    │
                    └──→ (N) video_stream_tags (N) ──→ (1) stream_tags
```

### ニュース関連の関係性
```
news_categories (1) ──→ (N) news
```

## 設計上の特徴

### パフォーマンス最適化
1. **検索最適化**
   - `videos.description`に対するGINインデックス（全文検索用）
   - 日付関連フィールドでの降順インデックス

2. **参照最適化**  
   - 頻繁に使用される外部キーにインデックス設定
   - 複合インデックスによる効率的な絞り込み

### データ整合性
1. **CASCADE制約**
   - 親レコード削除時の子レコード自動削除
   - データの整合性を保持

2. **RESTRICT制約**
   - マスターデータの誤削除防止（video_types等）

### 拡張性
1. **中間テーブル設計**
   - 多対多関係の適切な正規化
   - 将来的な属性追加に対する柔軟性

2. **タイムスタンプ管理**
   - 全テーブルに`created_at`フィールド
   - データ追跡・監査対応

## 注意事項

### タグ管理の分離
- 動画用と配信用でタグテーブルが分離されている
- `video_tags` / `video_video_tags`: 動画専用のタグ管理
- `stream_tags` / `video_stream_tags`: 配信専用のタグ管理
- より精密な検索・分類が可能

### マイグレーション管理
- Liquibaseによるスキーマ変更管理
- `db/changelog/`配下でマイグレーションファイルを管理