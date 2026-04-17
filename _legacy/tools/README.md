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

> **Note**: このプロジェクトでは `just` コマンドランナーを使用しています。[インストール方法](https://github.com/casey/just#installation)

### コマンド一覧の確認

```bash
# プロジェクトルートから全コマンドを確認
just --list

# または
just
```

### 初回セットアップ

```bash
# 開発環境のセットアップ
just setup-dev

# 本番環境のセットアップ
just setup-prd
```

### YouTube データ同期（推奨）

データ取得からDBインポートまでを一括実行：

```bash
# ローカル環境
just sync-local

# 開発環境
just sync-dev

# 本番環境
just sync-prd
```

### データ取得のみ

YouTube Data API からデータを取得してCSVファイルに保存：

```bash
# ローカル環境
just fetch-local

# 開発環境
just fetch-dev

# 本番環境
just fetch-prd
```

### データベースインポートのみ

最新の取得結果をデータベースにインポート：

```bash
# ローカル環境
just import-local

# 開発環境
just import-dev

# 本番環境
just import-prd
```

### ニュースデータインポート

```bash
# ローカル環境
just news-import-local

# 開発環境
just news-import-dev

# 本番環境
just news-import-prd
```

### スペシャルイベントデータインポート

```bash
# ローカル環境
just special-events-import-local

# 開発環境
just special-events-import-dev

# 本番環境
just special-events-import-prd
```

### データベース接続

#### 開発環境

```bash
# 接続開始
just db-dev

# 接続状況確認
just db-dev-status

# 接続終了
just db-dev-stop
```

#### 本番環境

```bash
# 接続開始
just db-prd

# 接続状況確認
just db-prd-status

# 接続終了
just db-prd-stop
```

## ファイル構成

```
tools/
├── justfile              # 各種ショートカットコマンド（Just）
├── Makefile              # 各種ショートカットコマンド（非推奨・削除予定）
├── README.md             # このファイル
├── config/               # 環境設定ファイル（.env.*）
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

1. just sync-local
2. just stream-tags-extract-local
3. tools/data/stream_tags.csv を編集
4. just stream-tags-import-local
5. just sync-prd
6. just stream-tags-import-prd
