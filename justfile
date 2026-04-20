# だんいんログ - 開発コマンド

web := "web"

# 初回セットアップ
setup:
    corepack enable
    cd {{web}} && pnpm install

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

# タグインポート（レビュー済み中間CSV → video_stream_tags）
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

# 楽曲インポート（レビュー済み中間CSV → songs + junction）
songs-import-stream:
    cd tools && just songs-import-stream

songs-import-live:
    cd tools && just songs-import-live

# アーティスト補完
artists:
    cd tools && just artists

# CSV → SQLite 変換（初回 or 再構築時のみ）
migrate:
    cd tools && just migrate

# ---------- インフラ ----------

# ローカル DB を S3 にアップロード + Vercel Deploy Hook でリビルド
deploy-data:
    aws s3 cp web/data/danin-log.db "s3://${AWS_S3_BUCKET:-danin-log-data}/danin-log.db"
    @echo "DB uploaded to S3."
    @HOOK=$$(aws secretsmanager get-secret-value --secret-id /danin-log/vercel-deploy-hook --region ap-northeast-1 --query SecretString --output text) && \
        curl -s -X POST "$$HOOK" && echo "Deploy hook triggered."

# Lambda zip パッケージング
package-lambda:
    ./infrastructure/scripts/package-lambda.sh

# Lambda パッケージング + Terraform デプロイ
deploy-lambda:
    ./infrastructure/scripts/package-lambda.sh
    cd infrastructure/terraform && terraform apply -target=module.data_pipeline