# だんいんログ - 開発コマンド

web := "web"

# 初回セットアップ
setup:
    corepack enable
    cd {{web}} && pnpm install
    just sync-data-local

# 開発サーバー起動
dev:
    cd {{web}} && pnpm dev

# ビルド（本番と同じフロー）
build:
    cd {{web}} && pnpm build

# lint
lint:
    cd {{web}} && pnpm lint

# フォーマット
format:
    cd {{web}} && pnpm format

# フォーマットチェック
format-check:
    cd {{web}} && pnpm format:check

# データ同期: S3 から取得
sync-data:
    aws s3 sync s3://${AWS_S3_BUCKET}/csv/ {{web}}/data/

# データ同期: ローカルの tools/data/ からコピー
sync-data-local:
    mkdir -p {{web}}/data
    cp tools/data/*.csv {{web}}/data/

# ---------- データ管理（tools/justfile のエイリアス） ----------

# YouTube データ全件取得
fetch:
    cd tools && just fetch

# 単一動画取得
fetch-one video_id:
    cd tools && just fetch-one {{video_id}}

# チャンネル追加/更新
channel-add +channel_ids:
    cd tools && just channel-add {{channel_ids}}

# タグ自動分類（中間CSV出力）
tags:
    cd tools && just tags

# タグ全件再分類（中間CSV出力）
tags-all:
    cd tools && just tags-all

# タグインポート（レビュー済み中間CSV → video_stream_tags.csv）
tags-import:
    cd tools && just tags-import

# タグ精度検証
tags-verify:
    cd tools && just tags-verify

# 楽曲抽出（中間CSV出力）
songs:
    cd tools && just songs

# 楽曲抽出（歌枠のみ）
songs-stream:
    cd tools && just songs-stream

# 楽曲抽出（ライブのみ）
songs-live:
    cd tools && just songs-live

# 楽曲インポート（レビュー済み中間CSV → 正規化CSV）
songs-import-stream:
    cd tools && just songs-import-stream

songs-import-live:
    cd tools && just songs-import-live

# アーティスト補完
artists:
    cd tools && just artists

# tools/data/ → web/data/ に同期
data-sync:
    just sync-data-local