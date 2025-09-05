#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
extracted_songs_live.csvからsongsテーブルとconcert_songsテーブルへデータをインポートするスクリプト

使用方法:
1. 必要なライブラリがインストールされていることを確認
   pip install pandas psycopg2-binary
2. CSVファイルが tools/data/extracted_songs_live.csv に存在することを確認
3. このスクリプトを実行
   python3 concert_songs_importer.py
"""

import os
import sys
import csv
import uuid
import pandas as pd
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

# スクリプトのディレクトリを取得
script_dir = os.path.dirname(os.path.abspath(__file__))

# 環境変数をロード（環境に応じて.envファイルを選択）
env_file = os.getenv('ENV_FILE')
if env_file:
    # ENV_FILEが指定されている場合はそれを使用
    if load_env_file(env_file):
        print(f"環境設定ファイルを読み込みました: {env_file}")
    else:
        print(f"警告: 指定された環境設定ファイル '{env_file}' が見つかりません")
else:
    # デフォルトの場所から.envファイルを探す
    config_dir = os.path.join(script_dir, '..', 'config')
    env_candidates = [
        os.path.join(config_dir, '.env.local'),
        os.path.join(config_dir, '.env'),
        os.path.join(script_dir, '.env')
    ]
    
    loaded = False
    for env_path in env_candidates:
        if load_env_file(env_path):
            print(f"環境設定ファイルを読み込みました: {env_path}")
            loaded = True
            break
    
    if not loaded:
        print("警告: 環境設定ファイルが見つかりません")

# データベース接続設定
db_host = os.getenv('DB_HOST', 'localhost')
# localhostの場合は127.0.0.1に変換（IPv6接続エラー回避）
if db_host == 'localhost':
    db_host = '127.0.0.1'

DB_CONFIG = {
    'host': db_host,
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'shirogane'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres')
}

def get_db_connection():
    """データベース接続を取得"""
    print(f"データベース接続情報:")
    print(f"  Host: {DB_CONFIG['host']}")
    print(f"  Port: {DB_CONFIG['port']}")
    print(f"  Database: {DB_CONFIG['database']}")
    print(f"  User: {DB_CONFIG['user']}")
    
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

def read_csv_file(file_path):
    """CSVファイルを読み込む"""
    if not os.path.exists(file_path):
        print(f"エラー: ファイル '{file_path}' が存在しません")
        sys.exit(1)
    
    df = pd.read_csv(file_path)
    print(f"CSVファイルを読み込みました: {file_path}")
    print(f"レコード数: {len(df)}")
    
    # 必要なカラムが存在するか確認
    required_columns = ['video_id', 'song_title', 'start_seconds']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        print(f"エラー: 必要なカラムが見つかりません: {missing_columns}")
        sys.exit(1)
    
    return df

def process_songs(conn, df):
    """曲情報の処理"""
    cursor = conn.cursor()
    
    # 既存のsongsテーブルからデータを取得
    cursor.execute("SELECT id, title FROM songs")
    existing_songs = {title: song_id for song_id, title in cursor.fetchall()}
    print(f"既存の曲数: {len(existing_songs)}")
    
    # ユニークな曲タイトルを抽出
    unique_titles = df['song_title'].unique()
    print(f"CSVからのユニークな曲数: {len(unique_titles)}")
    
    # 新規登録が必要な曲を特定
    new_songs = []
    for title in unique_titles:
        if title not in existing_songs:
            song_id = str(uuid.uuid4())
            new_songs.append((song_id, title, 'TODO'))
            existing_songs[title] = song_id
    
    print(f"新規登録予定の曲数: {len(new_songs)}")
    
    # titleにユニーク制約を追加する必要があるか確認
    cursor.execute("""
        SELECT constraint_name 
        FROM information_schema.constraint_column_usage 
        WHERE table_name = 'songs' AND column_name = 'title'
    """)
    
    if not cursor.fetchone():
        # titleにユニーク制約を追加
        print("titleカラムにユニーク制約を追加します...")
        try:
            cursor.execute("ALTER TABLE songs ADD CONSTRAINT songs_title_unique UNIQUE (title)")
            conn.commit()
            print("ユニーク制約を追加しました")
        except psycopg2.errors.DuplicateTable:
            print("ユニーク制約は既に存在しています")
            conn.rollback()
    
    # 新規曲をsongsテーブルに登録
    if new_songs:
        print("\n=== 新規曲をsongsテーブルに登録中 ===")
        insert_query = """
            INSERT INTO songs (id, title, artist) 
            VALUES (%s, %s, %s)
            ON CONFLICT (title) DO NOTHING
        """
        
        try:
            for song_data in new_songs:
                cursor.execute(insert_query, song_data)
            conn.commit()
            print(f"songs: {len(new_songs)}件の新規データを登録しました")
        except Exception as e:
            conn.rollback()
            print(f"songsテーブル登録エラー: {str(e)}")
            raise
    else:
        print("新規登録が必要な曲はありません")
    
    cursor.close()
    return existing_songs

def process_concert_songs(conn, df, songs_dict):
    """concert_songsテーブルのデータ処理"""
    cursor = conn.cursor()
    
    # 既存のconcert_songsテーブルからデータを取得
    cursor.execute("SELECT song_id, video_id, start_seconds FROM concert_songs")
    existing_concert_songs = set()
    for row in cursor.fetchall():
        existing_concert_songs.add((row[0], row[1], row[2]))
    
    print(f"既存のconcert_songs数: {len(existing_concert_songs)}")
    
    # concert_songsテーブルにデータを準備
    concert_songs_data = []
    
    for idx, row in df.iterrows():
        song_title = row['song_title']
        video_id = row['video_id']
        
        # start_secondsがNaNの場合はエラー
        if pd.isna(row['start_seconds']):
            raise ValueError(f"エラー: 行 {idx + 2} (video_id: '{video_id}', song_title: '{song_title}') のstart_secondsがNaNです")
        
        start_seconds = int(row['start_seconds'])
        
        if song_title not in songs_dict:
            raise ValueError(f"エラー: 行 {idx + 2} の曲 '{song_title}' がsongsテーブルに存在しません")
        
        song_id = songs_dict[song_title]
        
        # 既存データと重複チェック
        if (song_id, video_id, start_seconds) not in existing_concert_songs:
            concert_songs_data.append((song_id, video_id, start_seconds))
    
    print(f"新規登録予定のconcert_songs数: {len(concert_songs_data)}")
    
    # concert_songsテーブルに登録
    if concert_songs_data:
        print("\n=== concert_songsテーブルに登録中 ===")
        query = """
            INSERT INTO concert_songs (song_id, video_id, start_seconds) 
            VALUES (%s, %s, %s)
            ON CONFLICT (song_id, video_id, start_seconds) 
            DO NOTHING
        """
        
        try:
            execute_batch(cursor, query, concert_songs_data)
            conn.commit()
            print(f"concert_songs: {len(concert_songs_data)}件のデータを登録しました")
        except Exception as e:
            conn.rollback()
            print(f"concert_songsテーブル登録エラー: {str(e)}")
            raise
    else:
        print("新規登録が必要なconcert_songsはありません")
    
    cursor.close()
    return len(concert_songs_data)

def verify_data(conn):
    """データの検証"""
    cursor = conn.cursor()
    
    print("\n=== 現在のデータ状況 ===")
    
    # songsテーブルの件数
    cursor.execute("SELECT COUNT(*) FROM songs")
    songs_count = cursor.fetchone()[0]
    print(f"songs: {songs_count}件")
    
    # concert_songsテーブルの件数
    cursor.execute("SELECT COUNT(*) FROM concert_songs")
    concert_songs_count = cursor.fetchone()[0]
    print(f"concert_songs: {concert_songs_count}件")
    
    # サンプルデータを表示
    print("\n=== 既存のconcert_songsサンプル (最初の5件) ===")
    cursor.execute("""
        SELECT s.title, cs.video_id, cs.start_seconds
        FROM concert_songs cs
        JOIN songs s ON s.id = cs.song_id
        LIMIT 5
    """)
    
    for row in cursor.fetchall():
        print(f"  曲: {row[0]}, 動画: {row[1]}, 開始時間: {row[2]}秒")
    
    cursor.close()

def main():
    """メイン処理"""
    # CSVファイルのパス
    csv_file_path = os.path.join(script_dir, '..', 'data', 'extracted_songs_live.csv')
    
    print(f"=== concert_songs インポート処理開始 ===")
    print(f"CSVファイル: {csv_file_path}")
    
    # CSVファイルを読み込む
    df = read_csv_file(csv_file_path)
    
    # データベースに接続
    conn = get_db_connection()
    
    try:
        # 1. songsテーブルの処理
        print("\n=== songsテーブルの処理 ===")
        songs_dict = process_songs(conn, df)
        
        # 2. concert_songsテーブルの処理
        print("\n=== concert_songsテーブルの処理 ===")
        new_concert_songs_count = process_concert_songs(conn, df, songs_dict)
        
        # データ検証
        verify_data(conn)
        
        print(f"\n=== 処理完了 ===")
        
    except Exception as e:
        print(f"\nエラーが発生しました: {str(e)}")
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    main()