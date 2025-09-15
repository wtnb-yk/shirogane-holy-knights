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

# YouTube動画データ取得・インポートツール ショートカット

## セットアップコマンド
setup-dev:
	cd scripts && ./setup-env.sh dev

setup-prd:
	cd scripts && ./setup-env.sh prd

## 統合実行コマンド
sync-local:
	cd scripts && ENV_FILE=../config/.env.local python3 youtube_data_pipeline.py $(filter-out $@,$(MAKECMDGOALS))

sync-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 youtube_data_pipeline.py $(filter-out $@,$(MAKECMDGOALS))

sync-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 youtube_data_pipeline.py $(filter-out $@,$(MAKECMDGOALS))

## データ取得のみ
fetch-local:
	cd scripts && ENV_FILE=../config/.env.local python3 youtube_data_fetcher.py $(filter-out $@,$(MAKECMDGOALS))

fetch-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 youtube_data_fetcher.py $(filter-out $@,$(MAKECMDGOALS))

fetch-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 youtube_data_fetcher.py $(filter-out $@,$(MAKECMDGOALS))

## DBインポートのみ（最新の結果ディレクトリを自動選択）
import-local:
	cd scripts && ENV_FILE=../config/.env.local python3 csv_to_db_importer.py $$(ls -1d ../output/youtube_data/20*/ | tail -1)

import-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 csv_to_db_importer.py $$(ls -1d ../output/youtube_data/20*/ | tail -1)

import-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 csv_to_db_importer.py $$(ls -1d ../output/youtube_data/20*/ | tail -1)

## ストリームタグ抽出
stream-tags-extract-local:
	cd scripts && python3 stream_tag_extractor.py

## ストリームタグインポート
stream-tags-import-local:
	cd scripts && ENV_FILE=../config/.env.local python3 stream_tags_importer.py

stream-tags-import-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 stream_tags_importer.py

stream-tags-import-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 stream_tags_importer.py

## ニュースデータインポート
news-import-local:
	cd scripts && ENV_FILE=../config/.env.local python3 news_importer.py

news-import-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 news_importer.py

news-import-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 news_importer.py

## カレンダーイベントデータインポート
calendar-import-local:
	cd scripts && ENV_FILE=../config/.env.local python3 calendar_importer.py

calendar-import-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 calendar_importer.py

calendar-import-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 calendar_importer.py

## 楽曲情報抽出
extract-songs:
	cd scripts && python3 extract_songs.py

extract-songs-stream:
	cd scripts && python3 extract_songs_stream.py

extract-songs-live:
	cd scripts && python3 extract_songs_live.py

## ストリーム楽曲インポート
stream-songs-import-local:
	cd scripts && ENV_FILE=../config/.env.local python3 stream_songs_importer.py

stream-songs-import-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 stream_songs_importer.py

stream-songs-import-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 stream_songs_importer.py

## アーティスト情報更新（Spotify APIで日本語アーティスト名を取得）
update-artists-local:
	cd scripts && ENV_FILE=../config/.env.local python3 update_song_artists.py

update-artists-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 update_song_artists.py

update-artists-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 update_song_artists.py

## コンサート楽曲インポート
concert-songs-import-local:
	cd scripts && ENV_FILE=../config/.env.local python3 concert_songs_importer.py

concert-songs-import-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 concert_songs_importer.py

concert-songs-import-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 concert_songs_importer.py

## チャンネル情報挿入
channel-insert-local:
	cd scripts && ENV_FILE=../config/.env.local python3 channel_inserter.py $(filter-out $@,$(MAKECMDGOALS))

channel-insert-dev:
	cd scripts && ENV_FILE=../config/.env.dev python3 channel_inserter.py $(filter-out $@,$(MAKECMDGOALS))

channel-insert-prd:
	cd scripts && ENV_FILE=../config/.env.prd python3 channel_inserter.py $(filter-out $@,$(MAKECMDGOALS))

# ダミーターゲットを追加（引数として渡されるチャンネルIDを無効化）
%:
	@:

.PHONY: setup-dev setup-prd sync-local sync-dev sync-prd fetch-local fetch-dev fetch-prd import-local import-dev import-prd news-import-local news-import-dev news-import-prd calendar-import-local calendar-import-dev calendar-import-prd stream-tags-extract-local stream-tags-import-local stream-tags-import-dev stream-tags-import-prd extract-songs extract-songs-stream extract-songs-live stream-songs-import-local stream-songs-import-dev stream-songs-import-prd update-artists-local update-artists-dev update-artists-prd concert-songs-import-local concert-songs-import-dev concert-songs-import-prd channel-insert-local channel-insert-dev channel-insert-prd db-dev db-dev-status db-dev-stop db-prd db-prd-status db-prd-stop
