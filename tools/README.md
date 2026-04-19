# tools/ — データ管理ツール

YouTube API / Spotify API からデータを取得・加工し、SQLite マスタデータ（`web/data/danin-log.db`）を管理するスクリプト群。

## ディレクトリ構成

```
tools/
├── scripts/          # Python スクリプト
├── data-review/      # 中間 CSV（人手レビュー用、gitignore）
├── config/           # .env.template 等
├── justfile          # データ管理コマンド
└── requirements.txt  # Python 依存
```

## セットアップ

```bash
pip install -r requirements.txt
cp config/.env.template config/.env
# .env に YouTube / Spotify API キーを設定
```

## スクリプト一覧

| スクリプト | 役割 |
|-----------|------|
| `youtube_data_fetcher.py` | YouTube API → channels / videos / stream_details / video_video_types を更新 |
| `channel_inserter.py` | チャンネル ID 指定 → YouTube API → channels に追加/更新 |
| `stream_tag_extractor.py` | 配信タイトルからタグ自動分類 → 中間 CSV。`--all` で全件、`--verify` で精度レポート |
| `tags_importer.py` | レビュー済み中間 CSV → video_stream_tags に反映 |
| `extract_songs.py` | YouTube コメントから楽曲セットリスト抽出 → 中間 CSV |
| `songs_importer.py` | レビュー済み中間 CSV → songs + junction テーブルに正規化 |
| `update_song_artists.py` | Spotify API で songs の artist='TODO' を補完 |
| `migrate_csv_to_sqlite.py` | CSV → SQLite 一括変換（初回 or 再構築時） |
| `db.py` | 共有 SQLite 接続ヘルパー |

---

## 運用フロー

### 1. 動画データ更新

```bash
# YouTube から最新データ取得 → DB 更新
just fetch
```

### 2. タグ分類

「抽出 → 人手レビュー → インポート」の3ステップ。

```bash
# Step 1: タグ自動分類 → 中間 CSV
just tags                    # 新着（未分類）のみ
just tags-all                # 全件再分類
```

中間 CSV（`data-review/extracted_tags.csv`）:

```csv
video_id,video_title,published_at,tags
-i1kocJQ_VU,#10【DARK SOULS Ⅱ】ストーリークリア目指して！...,2026-01-22 18:41:56,ゲーム
-rxkYVwwoDU,【マリオテニス フィーバー】人生初のマリオテニス！...,2026-03-10 13:23:19,"ゲーム,企画"
0km5t1EZoPo,【#今夜はノエルと吞まKnight】...,2025-12-12 12:47:50,
```

- `tags` はタグ名のカンマ区切り（ID ではなく名前）
- タグなし = 空欄
- `video_title` / `published_at` は参照用（インポート時は無視される）

```bash
# Step 2: 中間 CSV を人手でレビュー・修正
#   - 不要なタグを削除、足りないタグを追加
#   - タグ名は stream_tags テーブルのマスタ名と一致させる
#   - data-review/extracted_tags.csv を直接編集
```

```bash
# Step 3: インポート → video_stream_tags を更新
just tags-import
```

精度検証:

```bash
# 全件再分類 → 人手タグとの precision/recall レポート
just tags-verify

# キーワード追加は tag_keywords テーブルを編集 → 再度 --verify
```

### 3. 楽曲データ更新

「抽出 → 人手レビュー → インポート → アーティスト補完」の4ステップ。

```bash
# Step 1: YouTube コメントからセットリスト抽出 → 中間 CSV
just songs                   # 歌枠+ライブ両方
just songs-stream            # 歌枠のみ
just songs-live              # ライブのみ
```

中間 CSV（`data-review/extracted_songs_stream.csv` 等）:

```csv
video_id,video_title,song_title,artist,start_seconds
v4bR8rbid80,【縦型歌枠】前回の歌枠リベンジ！...,残酷な天使のテーゼ,高橋洋子,973
cKVqUyFmM_o,【#ノエル2000日記念】...,KICK BACK,米津玄師,1530
```

```bash
# Step 2: 中間 CSV を人手でレビュー・修正
#   - 誤抽出の行を削除
#   - 曲名・アーティスト名を修正
#   - data-review/extracted_songs_stream.csv を直接編集
```

```bash
# Step 3: インポート → songs + junction テーブルを更新
just songs-import-stream     # → songs + stream_songs
just songs-import-live       # → songs + concert_songs
```

```bash
# Step 4: artist='TODO' の新曲を Spotify API で補完
just artists
```
