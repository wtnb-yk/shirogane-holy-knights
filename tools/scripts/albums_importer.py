#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
albums.csvからPostgreSQLデータベースへアルバム情報をインポートするスクリプト

使用方法:
1. 必要なライブラリをインストール
   pip install pandas psycopg2-binary
2. .envファイルにデータベース接続情報を設定
3. スクリプトを実行
   python albums_importer.py
"""

import os
import sys
import csv
import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch
import uuid
from datetime import datetime

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
        sys.exit(1)

def get_album_type_id(conn, album_type_name):
    """アルバムタイプ名からIDを取得"""
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM album_types WHERE type_name = %s", (album_type_name,))
    result = cursor.fetchone()
    cursor.close()

    if result:
        return result[0]
    else:
        print(f"警告: アルバムタイプ '{album_type_name}' が見つかりません")
        return None

def find_or_create_song(conn, song_title):
    """楽曲名の完全一致で検索、見つからない場合は新規作成"""
    cursor = conn.cursor()

    # 完全一致で検索
    cursor.execute("SELECT id FROM songs WHERE title = %s", (song_title,))
    result = cursor.fetchone()

    if result:
        cursor.close()
        return result[0], False  # 既存楽曲のID, 新規作成フラグ

    # 新規作成
    song_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO songs (id, title, artist) VALUES (%s, %s, %s)",
        (song_id, song_title, "TODO")
    )
    conn.commit()
    cursor.close()

    return song_id, True  # 新規楽曲のID, 新規作成フラグ

def find_existing_album(conn, title, artist):
    """既存アルバムを検索"""
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM albums WHERE title = %s AND artist = %s", (title, artist))
    result = cursor.fetchone()
    cursor.close()
    return result[0] if result else None

def process_albums_csv(conn, csv_file_path):
    """albums.csvを処理してデータベースにインポート"""

    # CSVファイルの読み込み
    try:
        df = pd.read_csv(csv_file_path)
        print(f"CSVファイルを読み込みました: {len(df)}行")
    except Exception as e:
        print(f"CSVファイル読み込みエラー: {str(e)}")
        sys.exit(1)

    # 新規作成された楽曲を記録
    new_songs = []

    # アルバムごとにグループ化
    albums_data = {}

    for _, row in df.iterrows():
        album_title = row['title']
        artist = row['artist']
        album_type = row['album_type']
        release_date = row['release_date'] if pd.notna(row['release_date']) else None
        cover_image_url = row['cover_image_url'] if pd.notna(row['cover_image_url']) else None
        track_number = int(row['track_number'])
        song_title = row['song_title']

        # アルバムIDを生成（アルバム名＋アーティスト名で一意）
        album_key = f"{album_title}_{artist}"

        if album_key not in albums_data:
            albums_data[album_key] = {
                'title': album_title,
                'artist': artist,
                'album_type': album_type,
                'release_date': release_date,
                'cover_image_url': cover_image_url,
                'tracks': []
            }

        # トラック情報を追加
        albums_data[album_key]['tracks'].append({
            'track_number': track_number,
            'song_title': song_title
        })

    print(f"処理対象アルバム数: {len(albums_data)}")

    # データベースにインポート
    cursor = conn.cursor()

    for album_key, album_info in albums_data.items():
        try:
            # アルバムタイプIDを取得
            album_type_id = get_album_type_id(conn, album_info['album_type'])
            if album_type_id is None:
                print(f"スキップ: アルバム '{album_info['title']}' - 不明なアルバムタイプ")
                continue

            # 既存アルバムをチェック
            existing_album_id = find_existing_album(conn, album_info['title'], album_info['artist'])

            if existing_album_id:
                album_id = existing_album_id
                print(f"既存アルバムを更新: {album_info['title']}")
                # 既存のアルバムトラックを削除
                cursor.execute("DELETE FROM album_tracks WHERE album_id = %s", (album_id,))
                # アルバム情報を更新
                cursor.execute("""
                    UPDATE albums
                    SET album_type_id = %s, release_date = %s, cover_image_url = %s
                    WHERE id = %s
                """, (
                    album_type_id,
                    album_info['release_date'],
                    album_info['cover_image_url'],
                    album_id
                ))
            else:
                # 新規アルバム作成
                album_id = str(uuid.uuid4())
                print(f"新規アルバムを作成: {album_info['title']}")
                cursor.execute("""
                    INSERT INTO albums (id, title, artist, album_type_id, release_date, cover_image_url)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    album_id,
                    album_info['title'],
                    album_info['artist'],
                    album_type_id,
                    album_info['release_date'],
                    album_info['cover_image_url']
                ))

            # トラック情報を処理
            for track in album_info['tracks']:
                # 楽曲を検索/作成
                song_id, is_new = find_or_create_song(conn, track['song_title'])

                if is_new:
                    new_songs.append(track['song_title'])

                # アルバムトラック情報をインサート
                track_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO album_tracks (id, album_id, song_id, track_number)
                    VALUES (%s, %s, %s, %s)
                """, (
                    track_id,
                    album_id,
                    song_id,
                    track['track_number']
                ))

            conn.commit()
            print(f"インポート完了: {album_info['title']} ({len(album_info['tracks'])}曲)")

        except Exception as e:
            conn.rollback()
            print(f"エラー: アルバム '{album_info['title']}' のインポートに失敗 - {str(e)}")
            continue

    cursor.close()

    # 新規作成された楽曲をログ出力
    if new_songs:
        print(f"\n=== 新規作成された楽曲 ({len(new_songs)}曲) ===")
        for i, song in enumerate(new_songs, 1):
            print(f"{i:3d}. {song}")
    else:
        print("\n新規作成された楽曲はありません")

def verify_import(conn):
    """インポート結果を検証"""
    cursor = conn.cursor()

    print("\n=== インポート結果の検証 ===")

    # アルバム数
    cursor.execute("SELECT COUNT(*) FROM albums")
    album_count = cursor.fetchone()[0]
    print(f"アルバム数: {album_count}")

    # トラック数
    cursor.execute("SELECT COUNT(*) FROM album_tracks")
    track_count = cursor.fetchone()[0]
    print(f"アルバムトラック数: {track_count}")

    # 楽曲数（アーティストがTODOの楽曲）
    cursor.execute("SELECT COUNT(*) FROM songs WHERE artist = 'TODO'")
    todo_song_count = cursor.fetchone()[0]
    print(f"TODO楽曲数: {todo_song_count}")

    # アルバムタイプ別の集計
    cursor.execute("""
        SELECT at.type_name, COUNT(a.id)
        FROM albums a
        JOIN album_types at ON a.album_type_id = at.id
        GROUP BY at.type_name
        ORDER BY COUNT(a.id) DESC
    """)

    print("\nアルバムタイプ別集計:")
    for type_name, count in cursor.fetchall():
        print(f"  {type_name}: {count}件")

    cursor.close()

def main():
    """メイン処理"""

    # CSVファイルのパス
    csv_file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'albums.csv')

    if not os.path.exists(csv_file_path):
        print(f"エラー: CSVファイルが見つかりません: {csv_file_path}")
        sys.exit(1)

    print(f"CSVファイルパス: {csv_file_path}")

    # データベースに接続
    conn = get_db_connection()

    try:
        print("\n=== アルバムデータインポート開始 ===")

        # CSVファイルを処理
        process_albums_csv(conn, csv_file_path)

        # インポート結果を検証
        verify_import(conn)

        print("\n=== インポート完了 ===")

    except Exception as e:
        print(f"\nエラーが発生しました: {str(e)}")
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    main()