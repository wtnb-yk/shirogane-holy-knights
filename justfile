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