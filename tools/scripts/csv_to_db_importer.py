#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
CSVファイルからPostgreSQLデータベースへデータをインポートするスクリプト

使用方法:
1. 必要なライブラリをインストール
   pip install pandas psycopg2-binary
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
# dotenvを使わずに手動で環境変数をロード
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

# 環境変数をロード（環境に応じて.envファイルを選択）
env_file = os.getenv('ENV_FILE', '../config/.env')  # デフォルトは ../config/.env
if load_env_file(env_file):
    print(f"環境設定ファイルを読み込みました: {env_file}")
else:
    # フォールバック: カレントディレクトリの.envを試行
    fallback_env = '.env'
    if load_env_file(fallback_env):
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
        'stream_details': 'stream_details*.csv'
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
                ''     # icon_url
            ) 
            for _, row in channels_df.iterrows()
        ]
    
    # UPSERT クエリ（既存データがあれば更新）
    query = """
        INSERT INTO channels (id, title, handle, description, icon_url) 
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (id) 
        DO UPDATE SET 
            title = EXCLUDED.title,
            handle = EXCLUDED.handle,
            description = EXCLUDED.description,
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
    """動画基本情報をインポート（published_atも含む）"""
    if df is None or df.empty:
        print("動画データがありません")
        return None
    
    cursor = conn.cursor()
    
    # データを準備
    data = []
    video_types_data = []  # video_video_types テーブル用のデータ
    
    for _, row in df.iterrows():
        try:
            video_id = row['id']
            # published_atはvideos.csvから直接取得（動画でも配信でもsnippet.publishedAt）
            published_at = None
            if 'published_at' in row and pd.notna(row['published_at']):
                try:
                    published_at = pd.to_datetime(row['published_at']).strftime('%Y-%m-%d %H:%M:%S')
                except Exception as e:
                    print(f"動画ID {video_id} の日付変換エラー: {str(e)}")
            
            data.append((
                video_id,
                row['title'],
                row.get('description', ''),
                row.get('url', ''),
                row.get('thumbnail_url', ''),
                row.get('duration', None),
                published_at,  # published_atを追加
                row['channel_id']
            ))
            
            # video_typeが存在する場合、video_video_types用のデータを準備
            if 'video_type' in row:
                video_type_id = 1 if row['video_type'] == 'stream' else 2
                video_types_data.append((video_id, video_type_id))
                
        except Exception as e:
            print(f"動画ID {row['id']} のデータ準備エラー: {str(e)}")
            continue
    
    # UPSERT クエリ（published_atを含む）
    query = """
        INSERT INTO videos (id, title, description, url, thumbnail_url, duration, published_at, channel_id) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) 
        DO UPDATE SET 
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            url = EXCLUDED.url,
            thumbnail_url = EXCLUDED.thumbnail_url,
            duration = EXCLUDED.duration,
            published_at = EXCLUDED.published_at,
            channel_id = EXCLUDED.channel_id
    """
    
    try:
        execute_batch(cursor, query, data)
        conn.commit()
        print(f"videos: {len(data)}件のデータをインポートしました")
        return video_types_data  # video_types_dataを返す
    except Exception as e:
        conn.rollback()
        print(f"videosインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def import_stream_details(conn, df):
    """ライブ配信詳細情報をインポート（stream_details.csvから）"""
    if df is None or df.empty:
        print("ライブ配信詳細データがありません")
        return
    
    cursor = conn.cursor()
    
    # stream_details.csvからデータを準備
    data = []
    for _, row in df.iterrows():
        try:
            # started_atを適切なタイムスタンプ形式に変換
            started_at = pd.to_datetime(row['started_at']).strftime('%Y-%m-%d %H:%M:%S')
            data.append((
                row['video_id'],
                started_at
            ))
        except Exception as e:
            print(f"動画ID {row['video_id']} の配信開始時刻変換エラー: {str(e)}")
            continue
    
    if not data:
        print("stream_details: インポート対象のデータがありません")
        return
    
    # UPSERT クエリ
    query = """
        INSERT INTO stream_details (video_id, started_at) 
        VALUES (%s, %s)
        ON CONFLICT (video_id) 
        DO UPDATE SET 
            started_at = EXCLUDED.started_at
    """
    
    try:
        execute_batch(cursor, query, data)
        conn.commit()
        print(f"stream_details: {len(data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"stream_detailsインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def import_video_video_types(conn, video_types_data):
    """動画タイプ関連情報をインポート"""
    print(f"\n=== video_video_types インポート開始 ===")
    print(f"処理対象データ件数: {len(video_types_data) if video_types_data else 0}")
    
    if not video_types_data:
        print("動画タイプデータがありません")
        return
    
    # サンプルデータを表示
    print(f"サンプルデータ (最初の3件):")
    for i, data in enumerate(video_types_data[:3]):
        print(f"  {i+1}: video_id={data[0]}, video_type_id={data[1]}")
    
    cursor = conn.cursor()
    
    # 実行予定のSQL文を表示
    query = """
        INSERT INTO video_video_types (video_id, video_type_id) 
        VALUES (%s, %s)
        ON CONFLICT (video_id, video_type_id) 
        DO NOTHING
    """
    print(f"実行SQL: {query.strip()}")
    
    try:
        print("SQL実行中...")
        execute_batch(cursor, query, video_types_data)
        print("SQL実行完了、COMMITします...")
        conn.commit()
        print(f"video_video_types: {len(video_types_data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"video_video_typesインポートエラー: {str(e)}")
        print(f"エラータイプ: {type(e).__name__}")
        if hasattr(e, 'pgcode'):
            print(f"PostgreSQLエラーコード: {e.pgcode}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        cursor.close()

def verify_import(conn):
    """インポート結果を検証"""
    cursor = conn.cursor()
    
    tables = ['channels', 'videos', 'stream_details', 'video_video_types']
    
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
        
        # 2. 動画基本情報（published_atも含めて一括でインポート）
        video_types_data = None
        if 'videos' in csv_files:
            video_types_data = import_videos(conn, csv_files['videos'])
        
        # 3. ライブ配信詳細（stream_details.csvから）- 既にvideosテーブルにインポート済み
        if 'stream_details' in csv_files:
            import_stream_details(conn, csv_files['stream_details'])
        
        # 4. 動画タイプ関連
        if video_types_data:
            import_video_video_types(conn, video_types_data)
        
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
