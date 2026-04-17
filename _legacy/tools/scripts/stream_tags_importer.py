#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
stream_tags.csvファイルからvideo_stream_tagsテーブルへデータをインポートするスクリプト

使用方法:
1. 必要なライブラリをインストール
   pip install pandas psycopg2-binary
2. .envファイルにデータベース接続情報を設定
3. 実行方法:
   - デフォルトパス (../data/stream_tags.csv) を使用: python stream_tags_importer.py
   - カスタムパスを指定: python stream_tags_importer.py <csvファイルパス>
"""

import os
import sys
import csv
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

def get_stream_tags_mapping(conn):
    """stream_tagsテーブルから名前とIDのマッピングを取得"""
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id, name FROM stream_tags")
        tags = cursor.fetchall()
        
        # 名前をキーとした辞書を作成
        tag_mapping = {tag[1]: tag[0] for tag in tags}
        print(f"取得済みタグ: {len(tag_mapping)}件")
        
        return tag_mapping
    except Exception as e:
        print(f"stream_tagsテーブル取得エラー: {str(e)}")
        raise
    finally:
        cursor.close()

def parse_tag_names(tag_names_str):
    """スペース区切りのタグ名文字列を分割"""
    if not tag_names_str or tag_names_str.strip() == '':
        return []
    
    # スペースで分割
    tags = tag_names_str.strip().split()
    return [tag.strip() for tag in tags if tag.strip()]

def read_stream_tags_csv(csv_path):
    """stream_tags.csvファイルを読み込む"""
    if not os.path.exists(csv_path):
        print(f"エラー: ファイル '{csv_path}' が存在しません")
        sys.exit(1)
    
    stream_tag_data = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            stream_id = row.get('stream_id', '').strip()
            tag_names_str = row.get('stream_tag_names', '').strip()
            
            if not stream_id:
                continue
                
            # タグ名を分割
            tag_names = parse_tag_names(tag_names_str)
            
            stream_tag_data.append({
                'stream_id': stream_id,
                'tag_names': tag_names
            })
    
    print(f"CSVファイルから {len(stream_tag_data)} 件のストリームデータを読み込みました")
    return stream_tag_data

def get_existing_video_ids(conn):
    """videosテーブルから存在するvideo_idの集合を取得"""
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id FROM videos")
        video_ids = cursor.fetchall()
        
        # タプルのリストを集合に変換
        existing_video_ids = {video_id[0] for video_id in video_ids}
        print(f"videosテーブルの動画数: {len(existing_video_ids)}件")
        
        return existing_video_ids
    except Exception as e:
        print(f"videosテーブル取得エラー: {str(e)}")
        raise
    finally:
        cursor.close()

def import_video_stream_tags(conn, stream_tag_data, tag_mapping):
    """video_stream_tagsテーブルにデータをインポート"""
    cursor = conn.cursor()
    
    # 存在するvideo_idを取得
    existing_video_ids = get_existing_video_ids(conn)
    
    insert_data = []
    missing_tags = set()
    missing_videos = set()
    
    # データを準備
    for item in stream_tag_data:
        stream_id = item['stream_id']
        tag_names = item['tag_names']
        
        if not tag_names:
            continue
        
        # video_idの存在チェック
        if stream_id not in existing_video_ids:
            missing_videos.add(stream_id)
            continue
            
        for tag_name in tag_names:
            if tag_name in tag_mapping:
                tag_id = tag_mapping[tag_name]
                insert_data.append((stream_id, tag_id))
            else:
                missing_tags.add(tag_name)
    
    # 存在しないタグがある場合は警告
    if missing_tags:
        print(f"\n警告: 以下のタグがstream_tagsテーブルに存在しません:")
        for tag in sorted(missing_tags):
            print(f"  - {tag}")
        print("これらのタグは無視されます。")
    
    # 存在しない動画がある場合は警告
    if missing_videos:
        print(f"\n警告: 以下の動画IDがvideosテーブルに存在しません:")
        print(f"  対象件数: {len(missing_videos)}件")
        if len(missing_videos) <= 10:
            for video_id in sorted(missing_videos):
                print(f"  - {video_id}")
        else:
            for video_id in sorted(list(missing_videos)[:5]):
                print(f"  - {video_id}")
            print(f"  ... 他{len(missing_videos)-5}件")
        print("これらの動画のタグは無視されます。")
    
    if not insert_data:
        print("インポート対象のデータがありません")
        return
    
    print(f"\nインポート対象: {len(insert_data)} 件の関連データ")
    
    # UPSERT クエリ (重複は無視)
    query = """
        INSERT INTO video_stream_tags (video_id, tag_id) 
        VALUES (%s, %s)
        ON CONFLICT (video_id, tag_id) 
        DO NOTHING
    """
    
    try:
        execute_batch(cursor, query, insert_data)
        conn.commit()
        print(f"video_stream_tags: {len(insert_data)} 件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"video_stream_tagsインポートエラー: {str(e)}")
        raise
    finally:
        cursor.close()

def verify_import(conn, stream_tag_data):
    """インポート結果を検証"""
    cursor = conn.cursor()
    
    print("\n=== インポート結果の検証 ===")
    
    # 全体の件数確認
    cursor.execute("SELECT COUNT(*) FROM video_stream_tags")
    total_count = cursor.fetchone()[0]
    print(f"video_stream_tagsテーブル総件数: {total_count}")
    
    # インポートしたストリームのサンプル確認
    sample_stream_ids = [item['stream_id'] for item in stream_tag_data[:5]]
    if sample_stream_ids:
        placeholders = ','.join(['%s'] * len(sample_stream_ids))
        query = f"""
        SELECT vst.video_id, st.name 
        FROM video_stream_tags vst
        JOIN stream_tags st ON vst.tag_id = st.id
        WHERE vst.video_id IN ({placeholders})
        ORDER BY vst.video_id, st.name
        """
        cursor.execute(query, sample_stream_ids)
        results = cursor.fetchall()
        
        print(f"\nサンプル確認 (最初の5ストリーム):")
        current_stream = None
        for video_id, tag_name in results:
            if video_id != current_stream:
                print(f"  {video_id}:")
                current_stream = video_id
            print(f"    - {tag_name}")
    
    cursor.close()

def main():
    """メイン処理"""
    # デフォルトのCSVパスを設定
    default_csv_path = "../data/stream_tags.csv"
    
    if len(sys.argv) >= 2:
        csv_path = sys.argv[1]
    else:
        csv_path = default_csv_path
        print(f"デフォルトパスを使用: {csv_path}")
    
    if not os.path.exists(csv_path):
        print(f"エラー: ファイル '{csv_path}' が存在しません")
        print("使用方法: python stream_tags_importer.py [csvファイルパス]")
        sys.exit(1)
    
    print(f"=== Stream Tags Importer ===")
    print(f"CSVファイル: {csv_path}")
    
    # データベースに接続
    conn = get_db_connection()
    
    try:
        # stream_tagsテーブルからマッピングを取得
        tag_mapping = get_stream_tags_mapping(conn)
        
        # CSVファイルを読み込み
        stream_tag_data = read_stream_tags_csv(csv_path)
        
        # video_stream_tagsテーブルにインポート
        import_video_stream_tags(conn, stream_tag_data, tag_mapping)
        
        # 結果を検証
        verify_import(conn, stream_tag_data)
        
        print("\n=== インポート完了 ===")
        
    except Exception as e:
        print(f"\nエラーが発生しました: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    main()