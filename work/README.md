# YouTube動画データ取得・インポートツール

白銀ノエルさんのYouTubeチャンネルから動画情報を取得し、データベースにインポートするツールセットです。

## ディレクトリ構成

```
work/
├── scripts/                    # 実行スクリプト
│   ├── youtube_data_fetcher.py      # YouTube APIからデータ取得
│   ├── csv_to_db_importer.py        # CSVからDBインポート
│   ├── youtube_data_pipeline.py     # 統合実行スクリプト
│   └── setup-env.sh                 # 環境設定セットアップ
├── config/                     # 設定ファイル
│   ├── .env.local                   # ローカル環境設定（Git管理）
│   ├── .env.dev.template            # 開発環境設定テンプレート
│   └── .env.prd.template            # 本番環境設定テンプレート
├── docs/                       # ドキュメント
└── result/                     # CSV出力先（自動生成）
```

## セットアップ

1. 必要なPythonライブラリをインストール
```bash
python3 -m pip install google-api-python-client pandas psycopg2-binary python-dotenv
```

2. 環境に応じた設定ファイルを作成・編集

ローカル環境用（既に用意済み）:
```bash
# config/.env.local を直接編集
```

開発環境用:
```bash
cd scripts
./setup-env.sh dev
```

本番環境用:
```bash
cd scripts
./setup-env.sh prd
```

3. 環境設定ファイルを編集
- `YOUTUBE_API_KEY`: YouTube Data API v3のAPIキー
- `DB_PASSWORD`: データベースのパスワード
- その他のDB設定は環境に応じて変更

## 使用方法

**注意: スクリプトは `scripts/` ディレクトリ内で実行してください**

### 一括実行（推奨）

ローカル環境:
```bash
cd scripts
ENV_FILE=../config/.env.local python3 youtube_data_pipeline.py
```

開発環境:
```bash
cd scripts
ENV_FILE=../config/.env.dev python3 youtube_data_pipeline.py
```

本番環境:
```bash
cd scripts
ENV_FILE=../config/.env.prd python3 youtube_data_pipeline.py
```

### 個別実行

1. YouTube動画データ取得のみ
```bash
cd scripts
ENV_FILE=../config/.env.local python3 youtube_data_fetcher.py
```
結果は`result/YYYYMMDD_HHMMSS_XXXXXXXX/`ディレクトリに出力されます。

2. データベースインポートのみ
```bash
cd scripts
ENV_FILE=../config/.env.local python3 csv_to_db_importer.py ../result/YYYYMMDD_HHMMSS_XXXXXXXX
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
- 実際の設定ファイル（`.env.dev`, `.env.prd`）はGit管理対象外です