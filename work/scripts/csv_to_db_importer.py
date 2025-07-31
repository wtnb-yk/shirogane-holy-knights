#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
CSVファイルからPostgreSQLデータベースへデータをインポートするスクリプト

使用方法:
1. 必要なライブラリをインストール
   pip install pandas psycopg2-binary python-dotenv
2. .envファイルにデータベース接続情報を設定
3. CSVファイルのディレクトリを指定して実行
"""

import os
import sys
import csv
import glob
import datetime
import psycopg2
from psycopg2.extras import execute_batch
import pandas as pd
from dotenv import load_dotenv

# 環境変数をロード（環境に応じて.envファイルを選択）
env_file = os.getenv('ENV_FILE', '../config/.env')  # デフォルトは ../config/.env
if os.path.exists(env_file):
    load_dotenv(env_file)
    print(f"環境設定ファイルを読み込みました: {env_file}")
else:
    # フォールバック: カレントディレクトリの.envを試行
    fallback_env = '.env'
    if os.path.exists(fallback_env):
        load_dotenv(fallback_env)
        print(f"環境設定ファイルを読み込みました: {fallback_env}")
    else:
        print("警告: 環境設定ファイルが見つかりません")

# データベース接続設定
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'shirogane'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', '')
}

def get_db_connection():
    """データベース接続を取得"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"データベース接続エラー: {str(e)}")
        sys.exit(1)

def read_csv_files(directory):
    """指定ディレクトリからCSVファイルを読み込む"""
    csv_files = {}
    
    # 必要なCSVファイルのパターン
    file_patterns = {
        'channels': 'channels.csv',
        'channel_details': 'channel_details.csv',
        'archives': 'archives*.csv',  # 分割ファイル対応
        'video_details': 'video_details*.csv',
        'content_details': 'content_details*.csv'
    }
    
    for key, pattern in file_patterns.items():
        files = glob.glob(os.path.join(directory, pattern))
        if not files:
            print(f"警告: {pattern} が見つかりません")
            continue
        
        # 複数ファイルがある場合は結合
        if len(files) > 1:
            dfs = []
            for file in sorted(files):
                df = pd.read_csv(file)
                dfs.append(df)
            csv_files[key] = pd.concat(dfs, ignore_index=True)
            print(f"{key}: {len(files)}個のファイルを結合しました")
        else:
            csv_files[key] = pd.read_csv(files[0])
            print(f"{key}: {files[0]} を読み込みました")
    
    return csv_files

def import_channels(conn, df):
    """チャンネル情報をインポート"""
    if df is None or df.empty:
        print("チャンネルデータがありません")
        return
    
    cursor = conn.cursor()
    
    # データを準備
    data = [(row['id'], row['title']) for _, row in df.iterrows()]
    
    # UPSERT クエリ（既存データがあれば更新）
    query = """
        INSERT INTO channels (id, title) 
        VALUES (%s, %s)
        ON CONFLICT (id) 
        DO UPDATE SET title = EXCLUDED.title
    """
    
    try:
        execute_batch(cursor, query, data)
        conn.commit()
        print(f"channels: {len(data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"channelsインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def import_channel_details(conn, df):
    """チャンネル詳細情報をインポート"""
    if df is None or df.empty:
        print("チャンネル詳細データがありません")
        return
    
    cursor = conn.cursor()
    
    # データを準備
    data = [
        (
            row['channel_id'],
            row.get('handle', None),
            row.get('description', ''),
            int(row.get('subscriber_count', 0)) if pd.notna(row.get('subscriber_count')) else 0,
            row.get('icon_url', '')
        ) 
        for _, row in df.iterrows()
    ]
    
    # UPSERT クエリ
    query = """
        INSERT INTO channel_details (channel_id, handle, description, subscriber_count, icon_url) 
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (channel_id) 
        DO UPDATE SET 
            handle = EXCLUDED.handle,
            description = EXCLUDED.description,
            subscriber_count = EXCLUDED.subscriber_count,
            icon_url = EXCLUDED.icon_url
    """
    
    try:
        execute_batch(cursor, query, data)
        conn.commit()
        print(f"channel_details: {len(data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"channel_detailsインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def import_archives(conn, df):
    """アーカイブ基本情報をインポート"""
    if df is None or df.empty:
        print("アーカイブデータがありません")
        return
    
    cursor = conn.cursor()
    
    # データを準備（published_atを適切なタイムスタンプ形式に変換）
    data = []
    for _, row in df.iterrows():
        try:
            # ISO 8601形式のタイムスタンプをパース
            published_at = pd.to_datetime(row['published_at']).strftime('%Y-%m-%d %H:%M:%S')
            data.append((
                row['id'],
                row['title'],
                published_at,
                row['channel_id']
            ))
        except Exception as e:
            print(f"アーカイブID {row['id']} の日付変換エラー: {str(e)}")
            continue
    
    # UPSERT クエリ
    query = """
        INSERT INTO archives (id, title, published_at, channel_id) 
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (id) 
        DO UPDATE SET 
            title = EXCLUDED.title,
            published_at = EXCLUDED.published_at,
            channel_id = EXCLUDED.channel_id
    """
    
    try:
        execute_batch(cursor, query, data)
        conn.commit()
        print(f"archives: {len(data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"archivesインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def import_video_details(conn, df):
    """動画詳細情報をインポート"""
    if df is None or df.empty:
        print("動画詳細データがありません")
        return
    
    cursor = conn.cursor()
    
    # データを準備
    data = [
        (
            row['archive_id'],
            row['url'],
            row.get('duration', None),
            row.get('thumbnail_url', '')
        ) 
        for _, row in df.iterrows()
    ]
    
    # UPSERT クエリ
    query = """
        INSERT INTO video_details (archive_id, url, duration, thumbnail_url) 
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (archive_id) 
        DO UPDATE SET 
            url = EXCLUDED.url,
            duration = EXCLUDED.duration,
            thumbnail_url = EXCLUDED.thumbnail_url
    """
    
    try:
        execute_batch(cursor, query, data)
        conn.commit()
        print(f"video_details: {len(data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"video_detailsインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def import_content_details(conn, df):
    """コンテンツ詳細情報をインポート"""
    if df is None or df.empty:
        print("コンテンツ詳細データがありません")
        return
    
    cursor = conn.cursor()
    
    # データを準備
    data = [
        (
            row['archive_id'],
            row.get('description', ''),
            False  # is_members_onlyは常にFalse
        ) 
        for _, row in df.iterrows()
    ]
    
    # UPSERT クエリ
    query = """
        INSERT INTO content_details (archive_id, description, is_members_only) 
        VALUES (%s, %s, %s)
        ON CONFLICT (archive_id) 
        DO UPDATE SET 
            description = EXCLUDED.description,
            is_members_only = EXCLUDED.is_members_only
    """
    
    try:
        execute_batch(cursor, query, data)
        conn.commit()
        print(f"content_details: {len(data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"content_detailsインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def verify_import(conn):
    """インポート結果を検証"""
    cursor = conn.cursor()
    
    tables = ['channels', 'channel_details', 'archives', 'video_details', 'content_details']
    
    print("\n=== インポート結果の検証 ===")
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"{table}: {count}件")
    
    cursor.close()

def main():
    """メイン処理"""
    if len(sys.argv) < 2:
        print("使用方法: python csv_to_db_importer.py <CSVディレクトリパス>")
        print("例: python csv_to_db_importer.py ./result/20241226_120000_abcd1234")
        sys.exit(1)
    
    csv_directory = sys.argv[1]
    
    if not os.path.exists(csv_directory):
        print(f"エラー: ディレクトリ '{csv_directory}' が存在しません")
        sys.exit(1)
    
    print(f"CSVディレクトリ: {csv_directory}")
    
    # CSVファイルを読み込む
    csv_files = read_csv_files(csv_directory)
    
    if not csv_files:
        print("エラー: CSVファイルが見つかりません")
        sys.exit(1)
    
    # データベースに接続
    conn = get_db_connection()
    
    try:
        # インポート順序が重要（外部キー制約のため）
        print("\n=== データインポート開始 ===")
        
        # 1. チャンネル情報
        if 'channels' in csv_files:
            import_channels(conn, csv_files['channels'])
        
        # 2. チャンネル詳細
        if 'channel_details' in csv_files:
            import_channel_details(conn, csv_files['channel_details'])
        
        # 3. アーカイブ基本情報
        if 'archives' in csv_files:
            import_archives(conn, csv_files['archives'])
        
        # 4. 動画詳細
        if 'video_details' in csv_files:
            import_video_details(conn, csv_files['video_details'])
        
        # 5. コンテンツ詳細
        if 'content_details' in csv_files:
            import_content_details(conn, csv_files['content_details'])
        
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