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
db_host = os.getenv('DB_HOST', 'localhost')
# localhostの場合は127.0.0.1に変換（IPv6接続エラー回避）
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

def read_csv_files(directory):
    """指定ディレクトリからCSVファイルを読み込む"""
    csv_files = {}
    
    # 必要なCSVファイルのパターン
    file_patterns = {
        'channels': 'channels.csv',
        'channel_details': 'channel_details.csv',
        'videos': 'videos*.csv',  # 分割ファイル対応
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

def import_channels(conn, channels_df, channel_details_df=None):
    """チャンネル情報をインポート（基本情報と詳細情報を統合）"""
    if channels_df is None or channels_df.empty:
        print("チャンネルデータがありません")
        return
    
    cursor = conn.cursor()
    
    # channel_detailsがある場合は結合してデータを準備
    if channel_details_df is not None and not channel_details_df.empty:
        # channels_dfのidとchannel_details_dfのchannel_idで結合
        merged_df = pd.merge(channels_df, channel_details_df, 
                           left_on='id', right_on='channel_id', how='left')
        
        data = [
            (
                row['id'],
                row['title'],
                row.get('handle', None),
                row.get('description', ''),
                int(row.get('subscriber_count', 0)) if pd.notna(row.get('subscriber_count')) else 0,
                row.get('icon_url', '')
            ) 
            for _, row in merged_df.iterrows()
        ]
    else:
        # channel_detailsがない場合は基本情報のみ
        data = [
            (
                row['id'],
                row['title'],
                None,  # handle
                '',    # description
                0,     # subscriber_count
                ''     # icon_url
            ) 
            for _, row in channels_df.iterrows()
        ]
    
    # UPSERT クエリ（既存データがあれば更新）
    query = """
        INSERT INTO channels (id, title, handle, description, subscriber_count, icon_url) 
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) 
        DO UPDATE SET 
            title = EXCLUDED.title,
            handle = EXCLUDED.handle,
            description = EXCLUDED.description,
            subscriber_count = EXCLUDED.subscriber_count,
            icon_url = EXCLUDED.icon_url
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

def import_videos(conn, df):
    """動画基本情報をインポート"""
    if df is None or df.empty:
        print("動画データがありません")
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
            print(f"動画ID {row['id']} の日付変換エラー: {str(e)}")
            continue
    
    # UPSERT クエリ
    query = """
        INSERT INTO videos (id, title, published_at, channel_id) 
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
        print(f"videos: {len(data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"videosインポートエラー: {str(e)}")
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
            row['video_id'],
            row['url'],
            row.get('duration', None),
            row.get('thumbnail_url', '')
        ) 
        for _, row in df.iterrows()
    ]
    
    # UPSERT クエリ
    query = """
        INSERT INTO video_details (video_id, url, duration, thumbnail_url) 
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (video_id) 
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
            row['video_id'],
            row.get('description', ''),
            False  # is_members_onlyは常にFalse
        ) 
        for _, row in df.iterrows()
    ]
    
    # UPSERT クエリ
    query = """
        INSERT INTO content_details (video_id, description, is_members_only) 
        VALUES (%s, %s, %s)
        ON CONFLICT (video_id) 
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
    
    tables = ['channels', 'videos', 'video_details', 'content_details']
    
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
        
        # 1. チャンネル情報（基本情報と詳細情報を統合）
        channels_df = csv_files.get('channels')
        channel_details_df = csv_files.get('channel_details')
        if channels_df is not None:
            import_channels(conn, channels_df, channel_details_df)
        
        # 3. 動画基本情報
        if 'videos' in csv_files:
            import_videos(conn, csv_files['videos'])
        
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