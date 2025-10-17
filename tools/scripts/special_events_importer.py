#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
special_events.csvファイルからPostgreSQLのspecial_eventsテーブルへデータをインポートするスクリプト

使用方法:
1. 必要なライブラリをインストール
   pip install pandas psycopg2-binary
2. .envファイルにデータベース接続情報を設定
3. 実行方法:
   - デフォルトパス (../data/special_events.csv) を使用: python special_events_importer.py
   - カスタムパスを指定: python special_events_importer.py <csvファイルパス>
"""

import os
import sys
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

def parse_date(date_str):
    """日付文字列をdateオブジェクトに変換"""
    if pd.isna(date_str) or date_str == '':
        return None

    # 文字列に変換
    if isinstance(date_str, (int, float)):
        date_str = str(int(date_str))
    else:
        date_str = str(date_str).strip()

    # 試行する日付形式のリスト
    date_formats = [
        '%Y-%m-%d',
        '%Y/%m/%d',
        '%m/%d/%Y',
        '%d/%m/%Y'
    ]

    for fmt in date_formats:
        try:
            return datetime.datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue

    # pandasのto_datetimeも試行
    try:
        return pd.to_datetime(date_str).date()
    except:
        pass

    print(f"警告: 日付形式を解析できませんでした: {date_str}")
    return None

def parse_datetime(date_str, use_end_of_day=False):
    """日付文字列をタイムスタンプに変換

    Args:
        date_str: 日付文字列
        use_end_of_day: Trueの場合は23:59:59、Falseの場合は00:00:00

    Returns:
        datetime object or None
    """
    date_obj = parse_date(date_str)
    if date_obj is None:
        return None

    if use_end_of_day:
        return datetime.datetime.combine(date_obj, datetime.time(23, 59, 59))
    else:
        return datetime.datetime.combine(date_obj, datetime.time(0, 0, 0))

def generate_event_id():
    """イベント用のユニークなIDを生成"""
    return str(uuid.uuid4())

def read_special_events_csv(csv_file_path):
    """special_events.csvファイルを読み込む"""
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
        required_columns = ['title', 'start_date', 'end_date']
        optional_columns = ['description']

        print("CSVカラム:", list(df.columns))

        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            print(f"エラー: 必須カラムが不足しています: {missing_columns}")
            sys.exit(1)

        return df

    except Exception as e:
        print(f"CSVファイル読み込みエラー: {str(e)}")
        sys.exit(1)

def validate_and_prepare_data(df):
    """データを検証し、インポート用に準備"""
    processed_data = []
    errors = []

    for index, row in df.iterrows():
        try:
            # 必須フィールドの検証
            title = str(row['title']).strip() if pd.notna(row['title']) else ''

            if not title:
                errors.append(f"行 {index + 2}: titleが空です")
                continue

            # 日付の解析
            start_date = parse_datetime(row['start_date'], use_end_of_day=False)
            if start_date is None:
                errors.append(f"行 {index + 2}: start_dateの形式が無効です: {row['start_date']}")
                continue

            end_date = parse_datetime(row['end_date'], use_end_of_day=True)
            if end_date is None:
                errors.append(f"行 {index + 2}: end_dateの形式が無効です: {row['end_date']}")
                continue

            # 日付の妥当性チェック
            if end_date <= start_date:
                errors.append(f"行 {index + 2}: end_dateはstart_dateより後である必要があります")
                continue

            # オプションフィールドの処理
            description = str(row['description']).strip() if 'description' in row and pd.notna(row['description']) else None

            # 空文字列をNoneに変換
            if description == '':
                description = None

            # IDを生成
            event_id = generate_event_id()

            processed_data.append({
                'id': event_id,
                'title': title,
                'description': description,
                'start_date': start_date,
                'end_date': end_date
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

def import_special_events_data(conn, events_data):
    """スペシャルイベントデータをデータベースにインポート"""
    if not events_data:
        print("インポート対象のデータがありません")
        return

    cursor = conn.cursor()

    # データを準備
    data = [
        (
            item['id'],
            item['title'],
            item['description'],
            item['start_date'],
            item['end_date']
        )
        for item in events_data
    ]

    # UPSERT クエリ（IDを指定）
    query = """
        INSERT INTO special_events (id, title, description, start_date, end_date)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (id)
        DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date
    """

    try:
        print(f"special_eventsテーブルに{len(data)}件のデータをインポート中...")

        # バッチでINSERT
        execute_batch(cursor, query, data)

        conn.commit()
        print(f"special_events: {len(data)}件のデータをインポートしました")

        # 結果の確認
        cursor.execute("SELECT COUNT(*) FROM special_events")
        total_count = cursor.fetchone()[0]
        print(f"special_eventsテーブルの総レコード数: {total_count}")

    except Exception as e:
        conn.rollback()
        print(f"special_eventsインポートエラー: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        cursor.close()

def clear_existing_data(conn):
    """既存のスペシャルイベントデータを全削除"""
    cursor = conn.cursor()

    print("\n=== 既存データの削除開始 ===")

    try:
        # 削除前の件数確認
        cursor.execute("SELECT COUNT(*) FROM special_events")
        events_count = cursor.fetchone()[0]

        print(f"削除前の件数:")
        print(f"  special_events: {events_count}件")

        print("special_eventsテーブルのデータを削除中...")
        cursor.execute("DELETE FROM special_events")
        deleted_events = cursor.rowcount

        conn.commit()

        print(f"削除完了:")
        print(f"  special_events: {deleted_events}件削除")

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

    # 総件数
    cursor.execute("SELECT COUNT(*) FROM special_events")
    total_count = cursor.fetchone()[0]
    print(f"総イベント数: {total_count}件")

    # ステータス別件数（現在日時基準）
    cursor.execute("""
        SELECT
            CASE
                WHEN start_date > CURRENT_TIMESTAMP THEN 'UPCOMING'
                WHEN end_date < CURRENT_TIMESTAMP THEN 'ENDED'
                ELSE 'ACTIVE'
            END as status,
            COUNT(*) as count
        FROM special_events
        GROUP BY status
        ORDER BY status
    """)

    status_results = cursor.fetchall()
    if status_results:
        print("\nステータス別集計:")
        for status, count in status_results:
            print(f"  {status}: {count}件")

    # 最新のイベント5件を表示
    cursor.execute("""
        SELECT title,
               start_date,
               end_date,
               CASE
                   WHEN start_date > CURRENT_TIMESTAMP THEN 'UPCOMING'
                   WHEN end_date < CURRENT_TIMESTAMP THEN 'ENDED'
                   ELSE 'ACTIVE'
               END as status
        FROM special_events
        ORDER BY start_date DESC, created_at DESC
        LIMIT 5
    """)

    recent_events = cursor.fetchall()
    if recent_events:
        print("\n最新のイベント5件:")
        for title, start_date, end_date, status in recent_events:
            print(f"  [{status}] {title} ({start_date} ~ {end_date})")

    cursor.close()

def main():
    """メイン処理"""
    if len(sys.argv) < 2:
        # デフォルトのCSVファイルパスを使用
        csv_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'special_events.csv')
        print(f"CSVファイルパスが指定されていません。デフォルトパスを使用: {csv_file_path}")
    else:
        csv_file_path = sys.argv[1]

    print(f"special_events.csvファイル: {csv_file_path}")

    # CSVファイルを読み込む
    df = read_special_events_csv(csv_file_path)

    if len(df) == 0:
        print("データがないため処理を終了します")
        return

    # データベースに接続
    conn = get_db_connection()

    try:
        print("\n=== スペシャルイベントデータインポート開始 ===")

        # データを検証・準備
        events_data = validate_and_prepare_data(df)

        # 既存データを削除
        clear_existing_data(conn)

        # データベースにインポート
        import_special_events_data(conn, events_data)

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
