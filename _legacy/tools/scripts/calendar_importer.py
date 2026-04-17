#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
calendar_events.csvファイルからPostgreSQLのeventsテーブルへデータをインポートするスクリプト

使用方法:
1. 必要なライブラリをインストール
   pip install pandas psycopg2-binary
2. .envファイルにデータベース接続情報を設定
3. 実行方法:
   - デフォルトパス (../data/calendar_events.csv) を使用: python calendar_importer.py
   - カスタムパスを指定: python calendar_importer.py <csvファイルパス>
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

# イベントタイプ名からIDへのマッピング
EVENT_TYPE_MAPPING = {
    'event': 1,
    'goods': 2,
    'campaign': 3,
    'others': 4,
    'collaboration': 5,
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

def get_event_type_mapping(conn):
    """データベースからイベントタイプマッピングを取得し、既存のマッピングと統合"""
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, type FROM event_types ORDER BY id")
        db_event_types = cursor.fetchall()

        print("データベースから取得したイベントタイプ:")
        for type_id, type_name in db_event_types:
            print(f"  {type_id}: {type_name}")
            # データベースからのイベントタイプ名も追加
            EVENT_TYPE_MAPPING[type_name] = type_id

        return EVENT_TYPE_MAPPING
    except Exception as e:
        print(f"イベントタイプ取得エラー: {str(e)}")
        raise
    finally:
        cursor.close()

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

def parse_time(time_str):
    """時刻文字列をtimeオブジェクトに変換"""
    if pd.isna(time_str) or time_str == '':
        return None

    time_str = str(time_str).strip()

    # 試行する時刻形式のリスト
    time_formats = [
        '%H:%M:%S',
        '%H:%M',
        '%I:%M:%S %p',
        '%I:%M %p'
    ]

    for fmt in time_formats:
        try:
            return datetime.datetime.strptime(time_str, fmt).time()
        except ValueError:
            continue

    print(f"警告: 時刻形式を解析できませんでした: {time_str}")
    return None

def generate_event_id():
    """イベント用のユニークなIDを生成"""
    return str(uuid.uuid4())

def read_calendar_events_csv(csv_file_path):
    """calendar_events.csvファイルを読み込む"""
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
        required_columns = ['title', 'event_types', 'event_date']
        optional_columns = ['description', 'event_time', 'end_date', 'end_time', 'url', 'image_url']

        print("CSVカラム:", list(df.columns))

        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            print(f"エラー: 必須カラムが不足しています: {missing_columns}")
            sys.exit(1)

        return df

    except Exception as e:
        print(f"CSVファイル読み込みエラー: {str(e)}")
        sys.exit(1)

def validate_and_prepare_data(df, event_type_mapping):
    """データを検証し、インポート用に準備"""
    processed_data = []
    errors = []

    for index, row in df.iterrows():
        try:
            # 必須フィールドの検証
            title = str(row['title']).strip() if pd.notna(row['title']) else ''
            event_types = str(row['event_types']).strip() if pd.notna(row['event_types']) else ''

            if not title:
                errors.append(f"行 {index + 2}: titleが空です")
                continue

            if not event_types:
                errors.append(f"行 {index + 2}: event_typesが空です")
                continue

            # イベントタイプIDの変換（複数イベントタイプ対応：半角スペース区切り）
            types = str(event_types).split(' ')  # 半角スペースで分割
            event_type_ids = []
            invalid_types = []

            for event_type in types:
                event_type = event_type.strip()  # 前後の空白を除去
                if event_type:  # 空文字列でない場合のみ処理
                    type_id = event_type_mapping.get(event_type)
                    if type_id is not None:
                        event_type_ids.append(type_id)
                    else:
                        invalid_types.append(event_type)

            if invalid_types:
                errors.append(f"行 {index + 2}: 無効なイベントタイプです: {', '.join(invalid_types)}")
                continue

            if not event_type_ids:
                errors.append(f"行 {index + 2}: 有効なイベントタイプが見つかりません: {event_types}")
                continue

            # 日付の解析
            event_date = parse_date(row['event_date'])
            if event_date is None:
                errors.append(f"行 {index + 2}: event_dateの形式が無効です: {row['event_date']}")
                continue

            # オプションフィールドの処理
            description = str(row['description']).strip() if pd.notna(row['description']) else None
            event_time = parse_time(row['event_time']) if 'event_time' in row and pd.notna(row['event_time']) else None
            end_date = parse_date(row['end_date']) if 'end_date' in row and pd.notna(row['end_date']) else None
            end_time = parse_time(row['end_time']) if 'end_time' in row and pd.notna(row['end_time']) else None
            url = str(row['url']).strip() if 'url' in row and pd.notna(row['url']) else None
            image_url = str(row['image_url']).strip() if 'image_url' in row and pd.notna(row['image_url']) else None

            # 空文字列をNoneに変換
            if description == '':
                description = None
            if url == '':
                url = None
            if image_url == '':
                image_url = None

            # IDを生成
            event_id = generate_event_id()

            processed_data.append({
                'id': event_id,
                'title': title,
                'event_type_ids': event_type_ids,  # 複数イベントタイプIDの配列
                'description': description,
                'event_date': event_date,
                'event_time': event_time,
                'end_date': end_date,
                'end_time': end_time,
                'url': url,
                'image_url': image_url
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

def import_events_data(conn, events_data):
    """イベントデータをデータベースにインポート（複数イベントタイプ対応）"""
    if not events_data:
        print("インポート対象のデータがありません")
        return None

    cursor = conn.cursor()

    # データを準備（event_type_idsは除外）
    data = [
        (
            item['id'],
            item['title'],
            item['description'],
            item['event_date'],
            item['event_time'],
            item['end_date'],
            item['end_time'],
            item['url'],
            item['image_url']
        )
        for item in events_data
    ]

    # UPSERT クエリ（IDを指定）
    query = """
        INSERT INTO events (id, title, description, event_date, event_time, end_date, end_time, url, image_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id)
        DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            event_date = EXCLUDED.event_date,
            event_time = EXCLUDED.event_time,
            end_date = EXCLUDED.end_date,
            end_time = EXCLUDED.end_time,
            url = EXCLUDED.url,
            image_url = EXCLUDED.image_url
    """

    try:
        print(f"eventsテーブルに{len(data)}件のデータをインポート中...")

        # イベントタイプ関連データを準備
        event_event_types_data = []
        for item in events_data:
            if 'event_type_ids' in item and item['event_type_ids']:
                for event_type_id in item['event_type_ids']:
                    event_event_types_data.append((item['id'], event_type_id))

        # バッチでINSERT
        execute_batch(cursor, query, data)

        conn.commit()
        print(f"events: {len(data)}件のデータをインポートしました")

        # 結果の確認
        cursor.execute("SELECT COUNT(*) FROM events")
        total_count = cursor.fetchone()[0]
        print(f"eventsテーブルの総レコード数: {total_count}")

        return event_event_types_data  # イベントタイプ関連データを返す

    except Exception as e:
        conn.rollback()
        print(f"eventsインポートエラー: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        cursor.close()

def import_event_event_types(conn, event_event_types_data):
    """イベントとイベントタイプの関連情報をインポート"""
    print(f"\n=== event_event_types インポート開始 ===")
    print(f"処理対象データ件数: {len(event_event_types_data) if event_event_types_data else 0}")

    if not event_event_types_data:
        print("イベントタイプ関連データがありません")
        return

    # サンプルデータを表示
    print(f"サンプルデータ (最初の3件):")
    for i, data in enumerate(event_event_types_data[:3]):
        print(f"  {i+1}: event_id={data[0]}, event_type_id={data[1]}")

    cursor = conn.cursor()

    # 実行予定のSQL文を表示
    query = """
        INSERT INTO event_event_types (event_id, event_type_id)
        VALUES (%s, %s)
        ON CONFLICT (event_id, event_type_id)
        DO NOTHING
    """
    print(f"実行SQL: {query.strip()}")

    try:
        print("SQL実行中...")
        execute_batch(cursor, query, event_event_types_data)
        print("SQL実行完了、COMMITします...")
        conn.commit()
        print(f"event_event_types: {len(event_event_types_data)}件のデータをインポートしました")
    except Exception as e:
        conn.rollback()
        print(f"event_event_typesインポートエラー: {str(e)}")
        print(f"エラータイプ: {type(e).__name__}")
        if hasattr(e, 'pgcode'):
            print(f"PostgreSQLエラーコード: {e.pgcode}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        cursor.close()

def clear_existing_data(conn):
    """既存のイベントデータを全削除"""
    cursor = conn.cursor()

    print("\n=== 既存データの削除開始 ===")

    try:
        # 削除前の件数確認
        cursor.execute("SELECT COUNT(*) FROM event_event_types")
        event_types_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM events")
        events_count = cursor.fetchone()[0]

        print(f"削除前の件数:")
        print(f"  event_event_types: {event_types_count}件")
        print(f"  events: {events_count}件")

        # 外部キー制約を考慮した順序で削除
        print("event_event_typesテーブルのデータを削除中...")
        cursor.execute("DELETE FROM event_event_types")
        deleted_event_types = cursor.rowcount

        print("eventsテーブルのデータを削除中...")
        cursor.execute("DELETE FROM events")
        deleted_events = cursor.rowcount

        conn.commit()

        print(f"削除完了:")
        print(f"  event_event_types: {deleted_event_types}件削除")
        print(f"  events: {deleted_events}件削除")

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

    # 各イベントタイプごとのレコード数を表示（中間テーブル経由）
    cursor.execute("""
        SELECT et.type, COUNT(eet.event_id) as count
        FROM event_types et
        LEFT JOIN event_event_types eet ON et.id = eet.event_type_id
        GROUP BY et.id, et.type
        ORDER BY et.id
    """)

    results = cursor.fetchall()
    for event_type, count in results:
        print(f"{event_type}: {count}件")

    # 最新のイベント5件を表示（複数イベントタイプ対応）
    cursor.execute("""
        SELECT e.title,
               STRING_AGG(et.type, ' ' ORDER BY et.id) as event_types,
               e.event_date,
               e.event_time
        FROM events e
        LEFT JOIN event_event_types eet ON e.id = eet.event_id
        LEFT JOIN event_types et ON eet.event_type_id = et.id
        GROUP BY e.id, e.title, e.event_date, e.event_time
        ORDER BY e.event_date DESC, e.created_at DESC
        LIMIT 5
    """)

    recent_events = cursor.fetchall()
    if recent_events:
        print("\n最新のイベント5件:")
        for title, event_types, event_date, event_time in recent_events:
            type_display = f"[{event_types}]" if event_types else "[タイプなし]"
            time_display = f" {event_time}" if event_time else ""
            print(f"  {type_display} {title} ({event_date}{time_display})")

    cursor.close()

def main():
    """メイン処理"""
    if len(sys.argv) < 2:
        # デフォルトのCSVファイルパスを使用
        csv_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'calendar_events.csv')
        print(f"CSVファイルパスが指定されていません。デフォルトパスを使用: {csv_file_path}")
    else:
        csv_file_path = sys.argv[1]

    print(f"calendar_events.csvファイル: {csv_file_path}")

    # CSVファイルを読み込む
    df = read_calendar_events_csv(csv_file_path)

    if len(df) == 0:
        print("データがないため処理を終了します")
        return

    # データベースに接続
    conn = get_db_connection()

    try:
        print("\n=== カレンダーイベントデータインポート開始 ===")

        # イベントタイプマッピングを取得
        event_type_mapping = get_event_type_mapping(conn)
        print(f"利用可能なイベントタイプマッピング: {event_type_mapping}")

        # データを検証・準備
        events_data = validate_and_prepare_data(df, event_type_mapping)

        # 既存データを削除
        clear_existing_data(conn)

        # データベースにインポート
        event_event_types_data = import_events_data(conn, events_data)

        # イベントタイプ関連をインポート
        if event_event_types_data:
            import_event_event_types(conn, event_event_types_data)

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