#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
music_videos.csvからPostgreSQLデータベースへミュージックビデオデータをインポートするスクリプト

使用方法:
python music_videos_importer.py tools/data/music_videos.csv
"""

import os
import sys
import csv
import uuid
import psycopg2
from psycopg2.extras import execute_batch

def load_env_file(env_file_path):
    """手動で.envファイルを読み込む"""
    if not os.path.exists(env_file_path):
        return False

    with open(env_file_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key.strip()] = value.strip()
    return True

# 環境変数をロード
env_file = os.getenv('ENV_FILE', '../config/.env')
if load_env_file(env_file):
    print(f"環境設定ファイルを読み込みました: {env_file}")
else:
    fallback_env = '.env'
    if load_env_file(fallback_env):
        print(f"環境設定ファイルを読み込みました: {fallback_env}")
    else:
        print("警告: 環境設定ファイルが見つかりません")

# データベース接続設定
db_host = os.getenv('DB_HOST', 'localhost')
if db_host == 'localhost':
    db_host = '127.0.0.1'

DB_CONFIG = {
    'host': db_host,
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'shirogane'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', '')
}

def get_db_connection():
    """データベース接続を取得"""
    print(f"データベース接続情報:")
    print(f"  Host: {DB_CONFIG['host']}")
    print(f"  Port: {DB_CONFIG['port']}")
    print(f"  Database: {DB_CONFIG['database']}")
    print(f"  User: {DB_CONFIG['user']}")
    print(f"  Password: {'*' * len(DB_CONFIG['password'])}")

    try:
        print("接続を開始します...")
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            database=DB_CONFIG['database'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            connect_timeout=10
        )
        print("接続成功！")
        return conn
    except Exception as e:
        print(f"データベース接続エラー: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

def read_music_videos_csv(csv_file_path):
    """music_videos.csvを読み込む"""
    if not os.path.exists(csv_file_path):
        print(f"エラー: CSVファイル '{csv_file_path}' が存在しません")
        sys.exit(1)

    music_videos = []
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['title'] and row['video_id'] and row['type']:
                music_videos.append({
                    'title': row['title'].strip(),
                    'video_id': row['video_id'].strip(),
                    'type': row['type'].strip()
                })

    print(f"CSVファイルから {len(music_videos)} 件のデータを読み込みました")
    return music_videos

def find_song_by_title(conn, title):
    """タイトルで楽曲を完全一致検索"""
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM songs WHERE title = %s", (title,))
        result = cursor.fetchone()
        return result[0] if result else None
    finally:
        cursor.close()

def create_new_song(conn, title):
    """新規楽曲を作成（artist='TODO'）"""
    cursor = conn.cursor()
    try:
        song_id = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO songs (id, title, artist) VALUES (%s, %s, %s)",
            (song_id, title, 'TODO')
        )
        conn.commit()
        return song_id
    except Exception as e:
        conn.rollback()
        print(f"新規楽曲作成エラー (title: {title}): {str(e)}")
        raise
    finally:
        cursor.close()

def get_music_video_type_id(type_name):
    """タイプ名からmusic_video_type_idを取得"""
    type_mapping = {
        'original': 1,
        'cover': 2
    }
    return type_mapping.get(type_name, 1)  # デフォルトはoriginal

def insert_music_videos(conn, music_videos_data):
    """music_videosテーブルにデータを挿入"""
    if not music_videos_data:
        print("インサート対象のデータがありません")
        return

    cursor = conn.cursor()
    try:
        query = """
            INSERT INTO music_videos (song_id, video_id, music_video_type_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (song_id, video_id)
            DO UPDATE SET
                music_video_type_id = EXCLUDED.music_video_type_id
        """

        execute_batch(cursor, query, music_videos_data)
        conn.commit()
        print(f"music_videos: {len(music_videos_data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"music_videosインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def import_music_videos(conn, music_videos):
    """メインのインポート処理"""
    new_songs = []
    music_videos_data = []
    existing_songs_count = 0

    for mv in music_videos:
        title = mv['title']
        video_id = mv['video_id']
        type_name = mv['type']

        # 楽曲の検索
        song_id = find_song_by_title(conn, title)

        if song_id is None:
            # 新規楽曲を作成
            song_id = create_new_song(conn, title)
            new_songs.append({'title': title, 'song_id': song_id})
            print(f"新規楽曲を作成しました: {title} (ID: {song_id})")
        else:
            existing_songs_count += 1

        # music_video_type_idを取得
        music_video_type_id = get_music_video_type_id(type_name)

        # music_videosデータを準備
        music_videos_data.append((song_id, video_id, music_video_type_id))

    # music_videosテーブルにデータを挿入
    insert_music_videos(conn, music_videos_data)

    return new_songs, existing_songs_count

def print_summary(new_songs, existing_songs_count, total_count):
    """インポート結果のサマリーを出力"""
    print("\n=== インポート結果サマリー ===")
    print(f"総処理件数: {total_count}")
    print(f"既存楽曲: {existing_songs_count}")
    print(f"新規楽曲: {len(new_songs)}")

    if new_songs:
        print("\n=== 新規登録された楽曲 ===")
        for song in new_songs:
            print(f"  タイトル: {song['title']}")
            print(f"  UUID: {song['song_id']}")
            print(f"  アーティスト: TODO")
            print()

def main():
    """メイン処理"""
    if len(sys.argv) < 2:
        print("使用方法: python music_videos_importer.py <music_videos.csvのパス>")
        print("例: python music_videos_importer.py tools/data/music_videos.csv")
        sys.exit(1)

    csv_file_path = sys.argv[1]

    print(f"music_videos.csvインポーター")
    print(f"CSVファイル: {csv_file_path}")

    # CSVファイルを読み込む
    music_videos = read_music_videos_csv(csv_file_path)

    if not music_videos:
        print("エラー: CSVファイルにデータがありません")
        sys.exit(1)

    # データベースに接続
    conn = get_db_connection()

    try:
        print("\n=== インポート開始 ===")
        new_songs, existing_songs_count = import_music_videos(conn, music_videos)

        # 結果をサマリー出力
        print_summary(new_songs, existing_songs_count, len(music_videos))

        print("\n=== インポート完了 ===")

    except Exception as e:
        print(f"\nエラーが発生しました: {str(e)}")
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    main()