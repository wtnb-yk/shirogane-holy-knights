# shirogane-holy-knights - Just Commands
# プロジェクト全体のタスクランナー

# コマンド一覧を表示（デフォルト）
default:
	@just --list

# =============================================================================
# Backend Commands (backend/justfile)
# =============================================================================

# バックエンド: プロジェクトをビルド（テスト除外）
backend-build:
	cd backend && just build

# バックエンド: ビルド後にLocalStack Lambdaへデプロイ
backend-deploy:
	cd backend && just deploy

# バックエンド: LocalStackのデプロイ情報を表示
backend-info:
	cd backend && just info

# バックエンド: LocalStack Lambda環境をクリーンアップ
backend-clean:
	cd backend && just clean

# バックエンド: Lambda JARをビルド
backend-jar:
	cd backend && just jar

# =============================================================================
# Tools - Database Commands (tools/justfile)
# =============================================================================

# DB: dev環境データベースに接続
db-dev:
	cd tools && just db-dev

# DB: dev環境データベースの状態確認
db-dev-status:
	cd tools && just db-dev-status

# DB: dev環境データベース接続を停止
db-dev-stop:
	cd tools && just db-dev-stop

# DB: prd環境データベースに接続
db-prd:
	cd tools && just db-prd

# DB: prd環境データベースの状態確認
db-prd-status:
	cd tools && just db-prd-status

# DB: prd環境データベース接続を停止
db-prd-stop:
	cd tools && just db-prd-stop

# =============================================================================
# Tools - Setup Commands
# =============================================================================

# セットアップ: dev環境をセットアップ
setup-dev:
	cd tools && just setup-dev

# セットアップ: prd環境をセットアップ
setup-prd:
	cd tools && just setup-prd

# =============================================================================
# Tools - YouTube Data Pipeline
# =============================================================================

# YouTube: local環境でデータ取得とインポートを実行
sync-local video_id="":
	cd tools && just sync-local {{video_id}}

# YouTube: dev環境でデータ取得とインポートを実行
sync-dev video_id="":
	cd tools && just sync-dev {{video_id}}

# YouTube: prd環境でデータ取得とインポートを実行
sync-prd video_id="":
	cd tools && just sync-prd {{video_id}}

# YouTube: local環境でデータ取得のみ
fetch-local *args="":
	cd tools && just fetch-local {{args}}

# YouTube: dev環境でデータ取得のみ
fetch-dev *args="":
	cd tools && just fetch-dev {{args}}

# YouTube: prd環境でデータ取得のみ
fetch-prd *args="":
	cd tools && just fetch-prd {{args}}

# YouTube: local環境でDBインポートのみ（最新ディレクトリ自動選択）
import-local:
	cd tools && just import-local

# YouTube: dev環境でDBインポートのみ（最新ディレクトリ自動選択）
import-dev:
	cd tools && just import-dev

# YouTube: prd環境でDBインポートのみ（最新ディレクトリ自動選択）
import-prd:
	cd tools && just import-prd

# =============================================================================
# Tools - Stream Tags
# =============================================================================

# タグ: ストリームタグを抽出
stream-tags-extract-local:
	cd tools && just stream-tags-extract-local

# タグ: local環境にストリームタグをインポート
stream-tags-import-local:
	cd tools && just stream-tags-import-local

# タグ: dev環境にストリームタグをインポート
stream-tags-import-dev:
	cd tools && just stream-tags-import-dev

# タグ: prd環境にストリームタグをインポート
stream-tags-import-prd:
	cd tools && just stream-tags-import-prd

# =============================================================================
# Tools - News
# =============================================================================

# ニュース: local環境にニュースデータをインポート
news-import-local:
	cd tools && just news-import-local

# ニュース: dev環境にニュースデータをインポート
news-import-dev:
	cd tools && just news-import-dev

# ニュース: prd環境にニュースデータをインポート
news-import-prd:
	cd tools && just news-import-prd

# =============================================================================
# Tools - Calendar
# =============================================================================

# カレンダー: local環境にカレンダーイベントをインポート
calendar-import-local:
	cd tools && just calendar-import-local

# カレンダー: dev環境にカレンダーイベントをインポート
calendar-import-dev:
	cd tools && just calendar-import-dev

# カレンダー: prd環境にカレンダーイベントをインポート
calendar-import-prd:
	cd tools && just calendar-import-prd

# =============================================================================
# Tools - Songs
# =============================================================================

# 楽曲: 楽曲情報を抽出
extract-songs:
	cd tools && just extract-songs

# 楽曲: ストリーム楽曲情報を抽出
extract-songs-stream:
	cd tools && just extract-songs-stream

# 楽曲: ライブ楽曲情報を抽出
extract-songs-live:
	cd tools && just extract-songs-live

# 楽曲: local環境にストリーム楽曲をインポート
stream-songs-import-local:
	cd tools && just stream-songs-import-local

# 楽曲: dev環境にストリーム楽曲をインポート
stream-songs-import-dev:
	cd tools && just stream-songs-import-dev

# 楽曲: prd環境にストリーム楽曲をインポート
stream-songs-import-prd:
	cd tools && just stream-songs-import-prd

# 楽曲: local環境でアーティスト情報を更新（Spotify API）
update-artists-local:
	cd tools && just update-artists-local

# 楽曲: dev環境でアーティスト情報を更新（Spotify API）
update-artists-dev:
	cd tools && just update-artists-dev

# 楽曲: prd環境でアーティスト情報を更新（Spotify API）
update-artists-prd:
	cd tools && just update-artists-prd

# 楽曲: local環境にコンサート楽曲をインポート
concert-songs-import-local:
	cd tools && just concert-songs-import-local

# 楽曲: dev環境にコンサート楽曲をインポート
concert-songs-import-dev:
	cd tools && just concert-songs-import-dev

# 楽曲: prd環境にコンサート楽曲をインポート
concert-songs-import-prd:
	cd tools && just concert-songs-import-prd

# =============================================================================
# Tools - Channel
# =============================================================================

# チャンネル: local環境にチャンネル情報を挿入
channel-insert-local *args="":
	cd tools && just channel-insert-local {{args}}

# チャンネル: dev環境にチャンネル情報を挿入
channel-insert-dev *args="":
	cd tools && just channel-insert-dev {{args}}

# チャンネル: prd環境にチャンネル情報を挿入
channel-insert-prd *args="":
	cd tools && just channel-insert-prd {{args}}

# =============================================================================
# Tools - Music Videos
# =============================================================================

# MV: local環境にミュージックビデオデータをインポート
music-videos-import-local:
	cd tools && just music-videos-import-local

# MV: dev環境にミュージックビデオデータをインポート
music-videos-import-dev:
	cd tools && just music-videos-import-dev

# MV: prd環境にミュージックビデオデータをインポート
music-videos-import-prd:
	cd tools && just music-videos-import-prd

# =============================================================================
# Tools - Albums
# =============================================================================

# アルバム: local環境にアルバムデータをインポート
albums-import-local:
	cd tools && just albums-import-local

# アルバム: dev環境にアルバムデータをインポート
albums-import-dev:
	cd tools && just albums-import-dev

# アルバム: prd環境にアルバムデータをインポート
albums-import-prd:
	cd tools && just albums-import-prd
