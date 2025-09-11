#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
チャンネルIDを指定してchannelsテーブルに情報を挿入するスクリプト

使用方法:
1. 必要なライブラリをインストール
   pip install google-api-python-client psycopg2-binary
2. 環境設定ファイルを準備（config/.env.local等）
3. チャンネルIDを指定して実行
   python channel_inserter.py <CHANNEL_ID>
"""

import os
import sys
import psycopg2
import time
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

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

def load_environment():
    """環境設定を読み込む"""
    # 環境変数からENV_FILEを取得
    env_file = os.getenv('ENV_FILE', '../config/.env.local')
    
    if load_env_file(env_file):
        print(f"環境設定ファイルを読み込みました: {env_file}")
    else:
        # フォールバック: カレントディレクトリの.envを試行
        fallback_env = '.env'
        if load_env_file(fallback_env):
            print(f"環境設定ファイルを読み込みました: {fallback_env}")
        else:
            print("警告: 環境設定ファイルが見つかりません")

def get_youtube_service():
    """YouTube Data API サービスを初期化"""
    api_key = os.getenv('YOUTUBE_API_KEY')
    if not api_key:
        print("エラー: YOUTUBE_API_KEYが設定されていません")
        sys.exit(1)
    
    return build('youtube', 'v3', developerKey=api_key)

def get_db_connection():
    """データベース接続を取得"""
    db_host = os.getenv('DB_HOST', 'localhost')
    # localhostの場合は127.0.0.1に変換（IPv6接続エラー回避）
    if db_host == 'localhost':
        db_host = '127.0.0.1'

    db_config = {
        'host': db_host,
        'port': os.getenv('DB_PORT', '5432'),
        'database': os.getenv('DB_NAME', 'shirogane'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', '')
    }
    
    print(f"データベース接続情報:")
    print(f"  Host: {db_config['host']}")
    print(f"  Port: {db_config['port']}")
    print(f"  Database: {db_config['database']}")
    print(f"  User: {db_config['user']}")
    print(f"  Password: {'*' * len(db_config['password'])}")
    
    try:
        print("データベース接続を開始します...")
        conn = psycopg2.connect(
            host=db_config['host'],
            port=db_config['port'],
            database=db_config['database'],
            user=db_config['user'],
            password=db_config['password'],
            connect_timeout=10
        )
        print("データベース接続成功！")
        return conn
    except Exception as e:
        print(f"データベース接続エラー: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

def get_channel_info(youtube, channel_id):
    """YouTube APIからチャンネル情報を取得"""
    print(f"チャンネル {channel_id} の情報を取得中...")
    
    try:
        response = youtube.channels().list(
            part='snippet,statistics,brandingSettings',
            id=channel_id
        ).execute()
        
        if not response.get('items'):
            print(f"エラー: チャンネルID {channel_id} が見つかりません")
            return None
        
        channel = response['items'][0]
        
        # ハンドルを取得（複数の方法を試す）
        handle = None
        
        # 方法1: snippet.customUrl から取得
        if 'customUrl' in channel['snippet']:
            handle = channel['snippet']['customUrl']
            if not handle.startswith('@'):
                handle = '@' + handle
        
        # 方法2: brandingSettings.channel.customChannelUrlから取得
        if not handle and 'brandingSettings' in channel:
            branding = channel['brandingSettings']
            if 'channel' in branding and 'customChannelUrl' in branding['channel']:
                custom_url = branding['channel']['customChannelUrl']
                # URLから@handleを抽出
                if 'youtube.com/@' in custom_url:
                    handle = '@' + custom_url.split('youtube.com/@')[1]
        
        channel_info = {
            'id': channel['id'],
            'title': channel['snippet']['title'],
            'handle': handle,
            'description': channel['snippet'].get('description', ''),
            'icon_url': channel['snippet'].get('thumbnails', {}).get('high', {}).get('url', '')
        }
        
        # subscriber_countは削除されているのでログ出力のみ
        subscriber_count = channel.get('statistics', {}).get('subscriberCount')
        if subscriber_count:
            try:
                subscriber_count = int(subscriber_count)
            except ValueError:
                subscriber_count = None
        
        print(f"チャンネル情報を取得しました: {channel_info['title']}")
        print(f"  ハンドル: {channel_info['handle'] if channel_info['handle'] else '未設定'}")
        print(f"  説明: {channel_info['description'][:100]}{'...' if len(channel_info['description']) > 100 else ''}")
        print(f"  登録者数: {subscriber_count:,}人" if subscriber_count else "  登録者数: 非公開")
        
        return channel_info
        
    except HttpError as e:
        print(f"YouTube API エラー: {str(e)}")
        return None
    except Exception as e:
        print(f"チャンネル情報取得エラー: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def insert_channel(conn, channel_info):
    """channelsテーブルに情報を挿入"""
    cursor = conn.cursor()
    
    # UPSERT クエリ（既存データがあれば更新）
    query = """
        INSERT INTO channels (id, title, handle, description, icon_url) 
        VALUES (%(id)s, %(title)s, %(handle)s, %(description)s, %(icon_url)s)
        ON CONFLICT (id) 
        DO UPDATE SET 
            title = EXCLUDED.title,
            handle = EXCLUDED.handle,
            description = EXCLUDED.description,
            icon_url = EXCLUDED.icon_url
    """
    
    try:
        print("データベースに挿入中...")
        cursor.execute(query, channel_info)
        conn.commit()
        print(f"チャンネル情報を正常に挿入/更新しました: {channel_info['title']}")
        return True
    except Exception as e:
        conn.rollback()
        print(f"データベース挿入エラー: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        cursor.close()

def verify_insertion(conn, channel_id):
    """挿入結果を確認"""
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id, title, handle, description FROM channels WHERE id = %s", (channel_id,))
        result = cursor.fetchone()
        
        if result:
            print(f"\n=== 挿入結果確認 ===")
            print(f"ID: {result[0]}")
            print(f"タイトル: {result[1]}")
            print(f"ハンドル: {result[2] if result[2] else '未設定'}")
            print(f"説明: {result[3][:100]}{'...' if len(result[3]) > 100 else ''}" if result[3] else "説明: 未設定")
            return True
        else:
            print("エラー: 挿入されたデータが見つかりません")
            return False
    except Exception as e:
        print(f"確認クエリエラー: {str(e)}")
        return False
    finally:
        cursor.close()

def main():
    """メイン処理"""
    if len(sys.argv) < 2:
        print("使用方法: python channel_inserter.py <CHANNEL_ID>")
        print("例: python channel_inserter.py UCdyqAaZDKHXg4Ahi7VENThQ")
        sys.exit(1)
    
    channel_id = sys.argv[1].strip()
    
    if not channel_id:
        print("エラー: チャンネルIDが指定されていません")
        sys.exit(1)
    
    # 環境設定を読み込み
    load_environment()
    
    # YouTube API サービスを初期化
    youtube = get_youtube_service()
    
    # データベース接続
    conn = get_db_connection()
    
    try:
        # チャンネル情報を取得
        channel_info = get_channel_info(youtube, channel_id)
        
        if not channel_info:
            print("チャンネル情報の取得に失敗しました")
            sys.exit(1)
        
        # データベースに挿入
        if insert_channel(conn, channel_info):
            # 挿入結果を確認
            verify_insertion(conn, channel_id)
            print("\n=== 処理完了 ===")
        else:
            print("データベースへの挿入に失敗しました")
            sys.exit(1)
    
    except Exception as e:
        print(f"エラーが発生しました: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    main()