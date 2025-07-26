# YouTube動画データ取得・インポートツール

白銀ノエルさんのYouTubeチャンネルから動画情報を取得し、データベースにインポートするツールセットです。

## ファイル構成

- `youtube_data_fetcher.py` - YouTube Data APIを使用して動画データを取得しCSVに出力
- `csv_to_db_importer.py` - CSVファイルからPostgreSQLデータベースにデータをインポート
- `youtube_data_pipeline.py` - 上記2つの処理を自動実行する統合スクリプト
- `.env.template` - 環境変数設定のテンプレート

## セットアップ

1. 必要なPythonライブラリをインストール
```bash
python3 -m pip install google-api-python-client pandas psycopg2-binary python-dotenv
```

2. 環境に応じた設定ファイルを作成

開発環境用:
```bash
./setup-env.sh dev
```

本番環境用:
```bash
./setup-env.sh prd
```

3. 作成された環境設定ファイル（`.env.dev` または `.env.prd`）を編集
- `YOUTUBE_API_KEY`: YouTube Data API v3のAPIキー
- `DB_PASSWORD`: データベースのパスワード
- その他のDB設定は環境に応じて変更

## 使用方法

### 一括実行（推奨）

開発環境:
```bash
ENV_FILE=.env.dev python3 youtube_data_pipeline.py
```

本番環境:
```bash
ENV_FILE=.env.prd python3 youtube_data_pipeline.py
```

### 個別実行

1. YouTube動画データ取得のみ
```bash
ENV_FILE=.env.dev python3 youtube_data_fetcher.py
```
結果は`result/YYYYMMDD_HHMMSS_XXXXXXXX/`ディレクトリに出力されます。

2. データベースインポートのみ
```bash
ENV_FILE=.env.dev python3 csv_to_db_importer.py ./result/YYYYMMDD_HHMMSS_XXXXXXXX
```

## 出力ファイル

CSVファイルは以下の5種類が生成されます：
- `channels.csv` - チャンネル基本情報
- `channel_details.csv` - チャンネル詳細情報
- `archives.csv` - 動画基本情報
- `video_details.csv` - 動画詳細情報（URL、時間、サムネイル）
- `content_details.csv` - コンテンツ詳細情報（説明文）

※動画数が500件を超える場合は自動的に分割されます。

## データベーステーブル

以下のテーブルにデータがインポートされます：
- `channels`
- `channel_details`
- `archives`
- `video_details`
- `content_details`

## 注意事項

- YouTube API には利用制限があります（1日あたり10,000ユニット）
- 大量の動画がある場合、API制限に注意してください
- データベースへのインポートはUPSERT（既存データは更新）で実行されます