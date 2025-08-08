# YouTube動画データ取得・インポートツール ショートカット

## セットアップコマンド
setup-dev:
	cd scripts && ./setup-env.sh dev

setup-prd:
	cd scripts && ./setup-env.sh prd

## 統合実行コマンド
sync-local:
	cd scripts && ENV_FILE=../config/.env.local python3 youtube_data_pipeline.py

sync-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 youtube_data_pipeline.py

sync-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 youtube_data_pipeline.py

## データ取得のみ
fetch-local:
	cd scripts && ENV_FILE=../config/.env.local python3 youtube_data_fetcher.py

fetch-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 youtube_data_fetcher.py

fetch-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 youtube_data_fetcher.py

## DBインポートのみ（最新の結果ディレクトリを自動選択）
import-local:
	cd scripts && ENV_FILE=../config/.env.local python3 csv_to_db_importer.py $$(ls -1d ../result/20*/ | tail -1)

import-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 csv_to_db_importer.py $$(ls -1d ../result/20*/ | tail -1)

import-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 csv_to_db_importer.py $$(ls -1d ../result/20*/ | tail -1)

## ニュースデータインポート
news-import-local:
	cd scripts && ENV_FILE=../config/.env.local python3 news_importer.py

news-import-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 news_importer.py

news-import-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 news_importer.py

# データベース接続（Bastion経由）

## dev環境データベース接続
db-dev:
	./scripts/db.sh

db-dev-status:
	./scripts/db.sh status

db-dev-stop:
	./scripts/db.sh stop

## prd環境データベース接続
db-prd:
	./scripts/db.sh prd

db-prd-status:
	./scripts/db.sh prd status

db-prd-stop:
	./scripts/db.sh prd stop

.PHONY: setup-dev setup-prd sync-local sync-dev sync-prd fetch-local fetch-dev fetch-prd import-local import-dev import-prd news-import-local news-import-dev news-import-prd db-dev db-dev-status db-dev-stop db-prd db-prd-status db-prd-stop
