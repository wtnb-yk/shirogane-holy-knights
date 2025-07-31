#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
YouTube動画データ取得からデータベースインポートまでの一連の処理を自動化するスクリプト

処理フロー:
1. YouTube Data APIを使用して動画データを取得
2. CSVファイルに出力
3. CSVファイルからデータベースにインポート

使用方法:
1. 必要なライブラリをインストール
   pip install google-api-python-client pandas psycopg2-binary python-dotenv
2. .envファイルに設定を記載
3. 実行: python youtube_data_pipeline.py
"""

import os
import sys
import subprocess
import time
from datetime import datetime
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

# 設定
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', '')
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'shirogane'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', '')
}

def check_prerequisites():
    """必要な環境設定を確認"""
    errors = []
    
    # YouTube API キーの確認
    if not YOUTUBE_API_KEY:
        errors.append("YouTube API キーが設定されていません (YOUTUBE_API_KEY)")
    
    # データベース設定の確認
    if not DB_CONFIG['password']:
        errors.append("データベースパスワードが設定されていません (DB_PASSWORD)")
    
    # 必要なPythonモジュールの確認
    required_modules = [
        'googleapiclient',
        'pandas',
        'psycopg2',
        'dotenv'
    ]
    
    for module in required_modules:
        try:
            __import__(module)
        except ImportError:
            errors.append(f"Pythonモジュール '{module}' がインストールされていません")
    
    if errors:
        print("=== エラー: 必要な設定が不足しています ===")
        for error in errors:
            print(f"- {error}")
        print("\n.envファイルに必要な設定を追加してください")
        return False
    
    return True

def run_youtube_data_fetcher():
    """YouTube動画データ取得スクリプトを実行"""
    print("\n=== YouTube動画データ取得開始 ===")
    print(f"実行時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 環境変数を設定してスクリプトを実行
    env = os.environ.copy()
    env['YOUTUBE_API_KEY'] = YOUTUBE_API_KEY
    
    try:
        result = subprocess.run(
            [sys.executable, 'youtube_data_fetcher.py'],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            env=env,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print(f"エラー: YouTube動画データ取得に失敗しました")
            print(f"標準エラー: {result.stderr}")
            return None
        
        # 出力から作成されたディレクトリパスを抽出
        output_lines = result.stdout.split('\n')
        output_dir = None
        for line in output_lines:
            if '出力ディレクトリ:' in line:
                output_dir = line.split('出力ディレクトリ:')[1].strip()
                break
        
        if not output_dir:
            print("エラー: 出力ディレクトリが見つかりません")
            print(f"標準出力: {result.stdout}")
            return None
        
        print(f"動画データ取得完了: {output_dir}")
        return output_dir
        
    except Exception as e:
        print(f"エラー: スクリプト実行中にエラーが発生しました: {str(e)}")
        return None

def run_csv_to_db_importer(csv_directory):
    """CSVからデータベースへのインポートスクリプトを実行"""
    print(f"\n=== データベースインポート開始 ===")
    print(f"CSVディレクトリ: {csv_directory}")
    
    # 環境変数を設定してスクリプトを実行
    env = os.environ.copy()
    env.update({
        'DB_HOST': DB_CONFIG['host'],
        'DB_PORT': DB_CONFIG['port'],
        'DB_NAME': DB_CONFIG['database'],
        'DB_USER': DB_CONFIG['user'],
        'DB_PASSWORD': DB_CONFIG['password']
    })
    
    try:
        result = subprocess.run(
            [sys.executable, 'csv_to_db_importer.py', csv_directory],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            env=env,
            capture_output=True,
            text=True
        )
        
        print(result.stdout)
        
        if result.returncode != 0:
            print(f"エラー: データベースインポートに失敗しました")
            print(f"標準エラー: {result.stderr}")
            return False
        
        print("データベースインポート完了")
        return True
        
    except Exception as e:
        print(f"エラー: スクリプト実行中にエラーが発生しました: {str(e)}")
        return False

def check_env_templates():
    """環境変数テンプレートファイルの存在を確認"""
    config_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'config')
    templates = ['.env.dev.template', '.env.prd.template']
    
    missing_templates = []
    for template in templates:
        template_path = os.path.join(config_dir, template)
        if not os.path.exists(template_path):
            missing_templates.append(template)
    
    if missing_templates:
        print(f"警告: 以下のテンプレートファイルが見つかりません: {', '.join(missing_templates)}")
        print(f"config/ディレクトリを確認してください")

def main():
    """メイン処理"""
    print("=== YouTube動画データパイプライン ===")
    print("白銀ノエルさんのYouTube動画データを取得してデータベースにインポートします")
    
    # 環境設定テンプレートファイルの存在確認
    check_env_templates()
    
    # 必要な設定を確認
    if not check_prerequisites():
        sys.exit(1)
    
    # 処理開始時刻を記録
    start_time = time.time()
    
    # 1. YouTube動画データを取得
    output_dir = run_youtube_data_fetcher()
    if not output_dir:
        print("\nエラー: YouTube動画データ取得に失敗しました")
        sys.exit(1)
    
    # 2. データベースにインポート
    success = run_csv_to_db_importer(output_dir)
    if not success:
        print("\nエラー: データベースインポートに失敗しました")
        sys.exit(1)
    
    # 処理時間を計算
    elapsed_time = time.time() - start_time
    minutes = int(elapsed_time // 60)
    seconds = int(elapsed_time % 60)
    
    print(f"\n=== パイプライン処理完了 ===")
    print(f"処理時間: {minutes}分{seconds}秒")
    print(f"CSVファイル保存先: {output_dir}")
    print(f"データベース: {DB_CONFIG['database']}")
    
    # オプション: 古いCSVファイルを削除するか確認
    response = input("\nCSVファイルを削除しますか？ (y/N): ")
    if response.lower() == 'y':
        try:
            import shutil
            shutil.rmtree(output_dir)
            print("CSVファイルを削除しました")
        except Exception as e:
            print(f"CSVファイル削除エラー: {str(e)}")

if __name__ == "__main__":
    main()