# Tools

ツール集です。YouTubeデータの取得・インポート、ニュースデータ管理、データベース接続などの機能を提供します。

## 概要

このツールセットは以下の機能を提供します：

- **YouTube データ管理**: YouTube Data API を使用した動画・配信データの取得とデータベースへのインポート
- **ニュースデータ管理**: CSV ファイルからのニュースデータインポート  
- **データベース接続**: 各環境のデータベースへの接続（Bastion経由）

## 前提条件

### Python環境
```bash
pip install google-api-python-client pandas psycopg2-binary python-dotenv
```

### 環境設定ファイル
各環境用の設定ファイルが必要です：
- `config/.env.local` - ローカル環境用
- `config/.env.dev` - 開発環境用  
- `config/.env.prd` - 本番環境用

## 主要コマンド

### 初回セットアップ

```bash
# 開発環境のセットアップ
make setup-dev

# 本番環境のセットアップ
make setup-prd
```

### YouTube データ同期（推奨）

データ取得からDBインポートまでを一括実行：

```bash
# ローカル環境
make sync-local

# 開発環境
make sync-dev

# 本番環境
make sync-prd
```

### データ取得のみ

YouTube Data API からデータを取得してCSVファイルに保存：

```bash
# ローカル環境
make fetch-local

# 開発環境  
make fetch-dev

# 本番環境
make fetch-prd
```

### データベースインポートのみ

最新の取得結果をデータベースにインポート：

```bash
# ローカル環境
make import-local

# 開発環境
make import-dev

# 本番環境
make import-prd
```

### ニュースデータインポート

```bash
# ローカル環境
make news-import-local

# 開発環境
make news-import-dev

# 本番環境
make news-import-prd
```

### データベース接続

#### 開発環境

```bash
# 接続開始
make db-dev

# 接続状況確認
make db-dev-status

# 接続終了
make db-dev-stop
```

#### 本番環境

```bash
# 接続開始
make db-prd

# 接続状況確認
make db-prd-status

# 接続終了
make db-prd-stop
```

## ファイル構成

```
tools/
├── Makefile              # 各種ショートカットコマンド
├── README.md            # このファイル
├── config/              # 環境設定ファイル（.env.*）
└── scripts/
    ├── setup-env.sh               # 環境セットアップスクリプト
    ├── youtube_data_pipeline.py   # 統合実行スクリプト（取得→インポート）
    ├── youtube_data_fetcher.py    # YouTubeデータ取得専用
    ├── csv_to_db_importer.py      # CSVからDBインポート専用
    ├── news_importer.py           # ニュースデータインポート
    ├── news.csv                   # ニュースデータファイル
    ├── db.sh                      # データベース接続スクリプト
    └── result/                    # データ取得結果の保存先
        └── YYYYMMDD_HHMMSS_*/     # タイムスタンプ付きディレクトリ
```
## 運用

### 配信タグ

1. make sync-local 
2. make stream-tags-extract-local
3. tools/data/stream_tags.csv を編集 
4. make stream-tags-import-local
5. make sync-prd
6. make stream-tags-import-prd
