#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
news.csvファイルからPostgreSQLのnewsテーブルへデータをインポートするスクリプト

使用方法:
1. 必要なライブラリをインストール
   pip install pandas psycopg2-binary
2. .envファイルにデータベース接続情報を設定
3. news.csvファイルを指定して実行
   python news_importer.py news.csv
"""

import os
import sys
import csv
import uuid
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

# カテゴリ名からIDへのマッピング
CATEGORY_MAPPING = {
    'グッズ': 1,
    'コラボ': 2,
    'イベント': 3,
    'メディア': 4,
    'GOODS': 1,
    'COLLABORATION': 2,
    'EVENT': 3,
    'MEDIA': 4
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

def get_category_mapping(conn):
    """データベースからカテゴリマッピングを取得し、既存のマッピングと統合"""
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, name FROM news_categories ORDER BY id")
        db_categories = cursor.fetchall()
        
        print("データベースから取得したカテゴリ:")
        for cat_id, cat_name in db_categories:
            print(f"  {cat_id}: {cat_name}")
            # データベースからのカテゴリ名も追加
            CATEGORY_MAPPING[cat_name] = cat_id
        
        return CATEGORY_MAPPING
    except Exception as e:
        print(f"カテゴリ取得エラー: {str(e)}")
        raise
    finally:
        cursor.close()

def parse_datetime(date_str):
    """様々な日付形式を解析してdatetimeオブジェクトに変換"""
    if pd.isna(date_str) or date_str == '':
        return None
    
    # 文字列に変換
    if isinstance(date_str, (int, float)):
        date_str = str(int(date_str))
    else:
        date_str = str(date_str).strip()
    
    # 試行する日付形式のリスト
    date_formats = [
        '%Y-%m-%d %H:%M:%S',
        '%Y-%m-%d %H:%M',
        '%Y-%m-%d',
        '%Y/%m/%d %H:%M:%S',
        '%Y/%m/%d %H:%M',
        '%Y/%m/%d',
        '%m/%d/%Y %H:%M:%S',
        '%m/%d/%Y %H:%M',
        '%m/%d/%Y',
        '%d/%m/%Y %H:%M:%S',
        '%d/%m/%Y %H:%M',
        '%d/%m/%Y',
        '%Y-%m-%dT%H:%M:%S',
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y-%m-%dT%H:%M:%S.%fZ'
    ]
    
    for fmt in date_formats:
        try:
            return datetime.datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    
    # pandasのto_datetimeも試行
    try:
        return pd.to_datetime(date_str).to_pydatetime()
    except:
        pass
    
    print(f"警告: 日付形式を解析できませんでした: {date_str}")
    return None

def generate_news_id():
    """ニュース用のユニークなIDを生成"""
    return str(uuid.uuid4())

def read_news_csv(csv_file_path):
    """news.csvファイルを読み込む"""
    if not os.path.exists(csv_file_path):
        print(f"エラー: ファイル '{csv_file_path}' が存在しません")
        sys.exit(1)
    
    try:
        df = pd.read_csv(csv_file_path)
        print(f"CSVファイルを読み込みました: {csv_file_path}")
        print(f"レコード数: {len(df)}")
        
        if len(df) == 0:
            print("警告: CSVファイルにデータがありません")
            return df
        
        # カラムの確認
        required_columns = ['title', 'category', 'content', 'published_at']
        optional_columns = ['thumbnail_url', 'external_url']
        
        print("CSVカラム:", list(df.columns))
        
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            print(f"エラー: 必須カラムが不足しています: {missing_columns}")
            sys.exit(1)
        
        return df
    
    except Exception as e:
        print(f"CSVファイル読み込みエラー: {str(e)}")
        sys.exit(1)

def validate_and_prepare_data(df, category_mapping):
    """データを検証し、インポート用に準備"""
    processed_data = []
    errors = []
    
    for index, row in df.iterrows():
        try:
            # 必須フィールドの検証
            title = str(row['title']).strip() if pd.notna(row['title']) else ''
            category = str(row['category']).strip() if pd.notna(row['category']) else ''
            content = str(row['content']).strip() if pd.notna(row['content']) else ''
            
            if not title:
                errors.append(f"行 {index + 2}: titleが空です")
                continue
            
            if not category:
                errors.append(f"行 {index + 2}: categoryが空です")
                continue
            
            if not content:
                errors.append(f"行 {index + 2}: contentが空です")
                continue
            
            # カテゴリIDの変換（複数カテゴリ対応：半角スペース区切り）
            categories = str(category).split(' ')  # 半角スペースで分割
            category_ids = []
            invalid_categories = []
            
            for cat in categories:
                cat = cat.strip()  # 前後の空白を除去
                if cat:  # 空文字列でない場合のみ処理
                    category_id = category_mapping.get(cat)
                    if category_id is not None:
                        category_ids.append(category_id)
                    else:
                        invalid_categories.append(cat)
            
            if invalid_categories:
                errors.append(f"行 {index + 2}: 無効なカテゴリです: {', '.join(invalid_categories)}")
                continue
            
            if not category_ids:
                errors.append(f"行 {index + 2}: 有効なカテゴリが見つかりません: {category}")
                continue
            
            # 日付の解析
            published_at = parse_datetime(row['published_at'])
            if published_at is None:
                errors.append(f"行 {index + 2}: published_atの形式が無効です: {row['published_at']}")
                continue
            
            # オプションフィールドの処理
            thumbnail_url = str(row['thumbnail_url']).strip() if pd.notna(row['thumbnail_url']) else None
            external_url = str(row['external_url']).strip() if pd.notna(row['external_url']) else None
            
            # 空文字列をNoneに変換
            if thumbnail_url == '':
                thumbnail_url = None
            if external_url == '':
                external_url = None
            
            # IDを生成
            news_id = generate_news_id()
            
            processed_data.append({
                'id': news_id,
                'title': title,
                'category_ids': category_ids,  # 複数カテゴリIDの配列
                'content': content,
                'thumbnail_url': thumbnail_url,
                'external_url': external_url,
                'published_at': published_at
            })
            
        except Exception as e:
            errors.append(f"行 {index + 2}: データ処理エラー: {str(e)}")
    
    if errors:
        print("データ検証エラー:")
        for error in errors:
            print(f"  {error}")
        if len(errors) >= len(df):
            print("全てのレコードでエラーが発生しました。処理を中止します。")
            sys.exit(1)
        else:
            print(f"警告: {len(errors)}件のエラーがありました。有効な{len(processed_data)}件のみ処理します。")
    
    return processed_data

def import_news_data(conn, news_data):
    """ニュースデータをデータベースにインポート（複数カテゴリ対応）"""
    if not news_data:
        print("インポート対象のデータがありません")
        return None
    
    cursor = conn.cursor()
    
    # データを準備（category_idは除外）
    data = [
        (
            item['id'],
            item['title'],
            item['content'],
            item['thumbnail_url'],
            item['external_url'],
            item['published_at']
        )
        for item in news_data
    ]
    
    # カテゴリ関連データを準備
    news_categories_data = []
    for item in news_data:
        if 'category_ids' in item and item['category_ids']:
            for category_id in item['category_ids']:
                news_categories_data.append((item['id'], category_id))
    
    # UPSERT クエリ（category_idを削除）
    query = """
        INSERT INTO news (id, title, content, thumbnail_url, external_url, published_at) 
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) 
        DO UPDATE SET 
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            thumbnail_url = EXCLUDED.thumbnail_url,
            external_url = EXCLUDED.external_url,
            published_at = EXCLUDED.published_at
    """
    
    try:
        print(f"newsテーブルに{len(data)}件のデータをインポート中...")
        execute_batch(cursor, query, data)
        conn.commit()
        print(f"news: {len(data)}件のデータをインポートしました")
        
        # 結果の確認
        cursor.execute("SELECT COUNT(*) FROM news")
        total_count = cursor.fetchone()[0]
        print(f"newsテーブルの総レコード数: {total_count}")
        
        return news_categories_data  # カテゴリ関連データを返す
        
    except Exception as e:
        conn.rollback()
        print(f"newsインポートエラー: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        cursor.close()

def import_news_news_categories(conn, news_categories_data):
    """ニュースとカテゴリの関連情報をインポート"""
    print(f"\n=== news_news_categories インポート開始 ===")
    print(f"処理対象データ件数: {len(news_categories_data) if news_categories_data else 0}")
    
    if not news_categories_data:
        print("ニュースカテゴリ関連データがありません")
        return
    
    # サンプルデータを表示
    print(f"サンプルデータ (最初の3件):")
    for i, data in enumerate(news_categories_data[:3]):
        print(f"  {i+1}: news_id={data[0]}, news_category_id={data[1]}")
    
    cursor = conn.cursor()
    
    # 実行予定のSQL文を表示
    query = """
        INSERT INTO news_news_categories (news_id, news_category_id) 
        VALUES (%s, %s)
        ON CONFLICT (news_id, news_category_id) 
        DO NOTHING
    """
    print(f"実行SQL: {query.strip()}")
    
    try:
        print("SQL実行中...")
        execute_batch(cursor, query, news_categories_data)
        print("SQL実行完了、COMMITします...")
        conn.commit()
        print(f"news_news_categories: {len(news_categories_data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"news_news_categoriesインポートエラー: {str(e)}")
        print(f"エラータイプ: {type(e).__name__}")
        if hasattr(e, 'pgcode'):
            print(f"PostgreSQLエラーコード: {e.pgcode}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        cursor.close()

def clear_existing_data(conn):
    """既存のニュースデータを全削除"""
    cursor = conn.cursor()
    
    print("\n=== 既存データの削除開始 ===")
    
    try:
        # 削除前の件数確認
        cursor.execute("SELECT COUNT(*) FROM news_news_categories")
        categories_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM news")
        news_count = cursor.fetchone()[0]
        
        print(f"削除前の件数:")
        print(f"  news_news_categories: {categories_count}件")
        print(f"  news: {news_count}件")
        
        # 外部キー制約を考慮した順序で削除
        print("news_news_categoriesテーブルのデータを削除中...")
        cursor.execute("DELETE FROM news_news_categories")
        deleted_categories = cursor.rowcount
        
        print("newsテーブルのデータを削除中...")
        cursor.execute("DELETE FROM news")
        deleted_news = cursor.rowcount
        
        conn.commit()
        
        print(f"削除完了:")
        print(f"  news_news_categories: {deleted_categories}件削除")
        print(f"  news: {deleted_news}件削除")
        
    except Exception as e:
        conn.rollback()
        print(f"データ削除エラー: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        cursor.close()

def verify_import(conn):
    """インポート結果を検証"""
    cursor = conn.cursor()
    
    print("\n=== インポート結果の検証 ===")
    
    # 各カテゴリごとのレコード数を表示（中間テーブル経由）
    cursor.execute("""
        SELECT nc.name, COUNT(nnc.news_id) as count
        FROM news_categories nc
        LEFT JOIN news_news_categories nnc ON nc.id = nnc.news_category_id
        GROUP BY nc.id, nc.name
        ORDER BY nc.id
    """)
    
    results = cursor.fetchall()
    for category_name, count in results:
        print(f"{category_name}: {count}件")
    
    # 最新のニュース5件を表示（複数カテゴリ対応）
    cursor.execute("""
        SELECT n.title, 
               STRING_AGG(nc.name, ' ' ORDER BY nc.id) as categories, 
               n.published_at
        FROM news n
        LEFT JOIN news_news_categories nnc ON n.id = nnc.news_id
        LEFT JOIN news_categories nc ON nnc.news_category_id = nc.id
        GROUP BY n.id, n.title, n.published_at
        ORDER BY n.published_at DESC
        LIMIT 5
    """)
    
    recent_news = cursor.fetchall()
    if recent_news:
        print("\n最新のニュース5件:")
        for title, categories, published_at in recent_news:
            category_display = f"[{categories}]" if categories else "[カテゴリなし]"
            print(f"  {category_display} {title} ({published_at})")
    
    cursor.close()

def main():
    """メイン処理"""
    if len(sys.argv) < 2:
        print("使用方法: python news_importer.py <news.csvファイルパス>")
        print("例: python news_importer.py news.csv")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    
    print(f"news.csvファイル: {csv_file_path}")
    
    # CSVファイルを読み込む
    df = read_news_csv(csv_file_path)
    
    if len(df) == 0:
        print("データがないため処理を終了します")
        return
    
    # データベースに接続
    conn = get_db_connection()
    
    try:
        print("\n=== ニュースデータインポート開始 ===")
        
        # カテゴリマッピングを取得
        category_mapping = get_category_mapping(conn)
        print(f"利用可能なカテゴリマッピング: {category_mapping}")
        
        # データを検証・準備
        news_data = validate_and_prepare_data(df, category_mapping)
        
        # 既存データを削除
        clear_existing_data(conn)
        
        # データベースにインポート
        news_categories_data = import_news_data(conn, news_data)
        
        # ニュースカテゴリ関連をインポート
        if news_categories_data:
            import_news_news_categories(conn, news_categories_data)
        
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