#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Spotify APIを使用してsongsテーブルのアーティスト情報を更新するスクリプト

使用方法:
1. tools/config/.env.localにSpotify API認証情報を設定
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
2. 必要なライブラリをインストール
   pip install spotipy psycopg2-binary pandas
3. このスクリプトを実行
   python3 update_song_artists.py
"""

import os
import sys
import time
import uuid
import pandas as pd
import psycopg2
from datetime import datetime
from psycopg2.extras import execute_batch
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

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

# Spotify API設定
SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
    print("エラー: Spotify APIの認証情報が設定されていません")
    print("tools/config/.env.localにSPOTIFY_CLIENT_IDとSPOTIFY_CLIENT_SECRETを設定してください")
    sys.exit(1)

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
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.Error as e:
        print(f"データベース接続エラー: {e}")
        sys.exit(1)

def initialize_spotify():
    """Spotify APIクライアントを初期化"""
    try:
        auth_manager = SpotifyClientCredentials(
            client_id=SPOTIFY_CLIENT_ID,
            client_secret=SPOTIFY_CLIENT_SECRET
        )
        sp = spotipy.Spotify(auth_manager=auth_manager, language='ja')
        return sp
    except Exception as e:
        print(f"Spotify API初期化エラー: {e}")
        sys.exit(1)

def search_artist_on_spotify(sp, song_title):
    """Spotify APIで曲名からアーティスト情報を検索（複数候補をログ出力）"""
    try:
        # 日本市場で検索（候補を多めに取得）
        results = sp.search(q=song_title, type='track', limit=20, market='JP')
        
        if not results['tracks']['items']:
            # 日本市場で見つからない場合は全市場で検索
            results = sp.search(q=song_title, type='track', limit=20)
            if not results['tracks']['items']:
                return None, None
        
        # 曲名の正規化関数
        def normalize_title(title):
            import re
            # 空白、記号、英数字の全角半角を統一
            normalized = title.lower()
            normalized = re.sub(r'[　\s]+', '', normalized)  # 全角半角スペース削除
            normalized = re.sub(r'[!！?？～〜・]', '', normalized)  # 記号削除
            normalized = re.sub(r'[（）()「」『』【】]', '', normalized)  # 括弧削除
            return normalized
        
        # 曲名が一致するものをフィルタリング
        normalized_search = normalize_title(song_title)
        
        # 完全一致を最優先で探す
        exact_matches = []
        partial_matches = []
        
        for track in results['tracks']['items']:
            normalized_track = normalize_title(track['name'])
            
            if normalized_track == normalized_search:
                exact_matches.append(track)
            elif (normalized_search in normalized_track or 
                  normalized_track in normalized_search or
                  song_title.lower() in track['name'].lower()):
                partial_matches.append(track)
        
        # 候補の優先順位: 完全一致 > 部分一致 > 上位5件
        if exact_matches:
            candidates = exact_matches
        elif partial_matches:
            candidates = partial_matches[:10]  # 部分一致は最大10件
        else:
            candidates = results['tracks']['items'][:5]
        
        # 白銀ノエルがいたら即決定
        for track in candidates:
            artist_name = ', '.join([a['name'] for a in track['artists']])
            if '白銀ノエル' in artist_name:
                print(f"  🎯 「{song_title}」→ 白銀ノエルの楽曲を発見！即決定")
                return artist_name, track['name']
        
        # 複数候補がある場合はログに出力（詳細情報付き）
        if len(candidates) > 1:
            match_type = "完全一致" if exact_matches else "部分一致" if partial_matches else "一般検索"
            print(f"\n  📝 「{song_title}」の候補が{len(candidates)}件見つかりました ({match_type}):")
            for i, track in enumerate(candidates[:5]):  # 最大5件表示
                artists = ', '.join([a['name'] for a in track['artists']])
                album = track['album']
                release_date = album['release_date'][:4] if album['release_date'] else 'N/A'
                album_type = album['album_type']
                print(f"     {i+1}. {artists:<30} - {track['name']:<30} ({release_date}) [{album_type}] (人気度:{track['popularity']:3})")
        
        # 原曲を優先するスコアリング（リリース日＋アルバム情報活用）
        def get_priority_score(track):
            score = track['popularity']
            artist_name = track['artists'][0]['name']
            album = track['album']
            release_date = album['release_date']
            album_type = album['album_type']  # 'album', 'single', 'compilation'
            
            # 日本語文字が含まれているか判定（ひらがな・カタカナ・漢字）
            def contains_japanese(text):
                import re
                return bool(re.search(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]', text))
            
            # 完全一致の場合は大幅ボーナス
            normalized_track = normalize_title(track['name'])
            if normalized_track == normalized_search:
                score += 100
            
            # リリース日による原曲判定（古いほど高スコア）
            if release_date and len(release_date) >= 4:
                try:
                    year = int(release_date[:4])
                    # 1970年以降で計算（古いほどボーナス）
                    if year >= 1970 and year <= 2024:
                        age_bonus = (2024 - year) * 1.5  # 1年古いごとに+1.5点
                        score += age_bonus
                except ValueError:
                    pass
            
            # アルバムタイプによる判定
            if album_type == 'album':
                score += 30  # オリジナルアルバムを最優先
            elif album_type == 'single':
                score += 20  # シングルも信頼性高い
            elif album_type == 'compilation':
                score -= 10  # コンピレーションは後発の可能性
            
            # 日本のアーティストを優先（ボーナス）
            if contains_japanese(artist_name):
                score += 40
            
            # カバー版っぽいキーワードがあれば大幅減点
            track_name = track['name'].lower()
            artist_name_lower = artist_name.lower()
            
            cover_keywords = [
                'cv.', 'cv：', 'starring', 'feat.', 'cover', 'カバー',
                'live', 'ライブ', 'remix', 'リミックス', 'remaster',
                'remastered', '2019 remaster', 'live from'
            ]
            
            for keyword in cover_keywords:
                if keyword in track_name or keyword in artist_name_lower:
                    score -= 50  # カバー版は大幅減点
                    break
            
            return score
        
        # 最も適切なトラックを選択
        selected_track = max(candidates, key=get_priority_score)
        artist_names = ', '.join([artist['name'] for artist in selected_track['artists']])
        
        if len(candidates) > 1:
            print(f"     → 選択: {artist_names} (人気度: {selected_track['popularity']}, スコア: {get_priority_score(selected_track)})")
        
        return artist_names, selected_track['name']
    
    except Exception as e:
        print(f"Spotify検索エラー（{song_title}）: {e}")
        return None, None

def update_artists():
    """メイン処理: アーティスト情報を更新"""
    
    # Spotify APIを初期化
    print("Spotify APIを初期化中...")
    sp = initialize_spotify()
    
    # データベース接続
    print("データベースに接続中...")
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # TODOのアーティスト情報を持つ曲を取得
        print("更新対象の曲を取得中...")
        cur.execute("""
            SELECT id, title 
            FROM songs 
            WHERE artist = 'TODO'
            ORDER BY title
        """)
        songs = cur.fetchall()
        
        total_songs = len(songs)
        print(f"\n更新対象: {total_songs}曲")
        
        if total_songs == 0:
            print("更新対象の曲がありません")
            return
        
        # 結果を保存するリスト
        updated_songs = []
        not_found_songs = []
        
        # 進捗表示用
        processed = 0
        updated = 0
        
        print("\nアーティスト情報を検索中...")
        print("-" * 60)
        
        for song_id, title in songs:
            processed += 1
            
            # Spotify APIで検索
            artist_name, found_title = search_artist_on_spotify(sp, title)
            
            if artist_name:
                # データベースを更新
                cur.execute(
                    "UPDATE songs SET artist = %s WHERE id = %s",
                    (artist_name, song_id)
                )
                updated += 1
                updated_songs.append({
                    'id': str(song_id),
                    'title': title,
                    'artist': artist_name,
                    'spotify_title': found_title
                })
                print(f"✓ [{processed}/{total_songs}] {title[:30]:<30} → {artist_name}")
            else:
                not_found_songs.append({
                    'id': str(song_id),
                    'title': title
                })
                print(f"✗ [{processed}/{total_songs}] {title[:30]:<30} → 見つかりませんでした")
            
            # API制限対策（1秒間に10リクエストまで）
            time.sleep(0.1)
            
            # 10件ごとにコミット
            if processed % 10 == 0:
                conn.commit()
        
        # 最終コミット
        conn.commit()
        
        print("-" * 60)
        print(f"\n処理完了:")
        print(f"  - 処理した曲数: {processed}")
        print(f"  - 更新成功: {updated}")
        print(f"  - 見つからなかった曲: {len(not_found_songs)}")
        
        # 結果をCSVファイルに保存
        output_dir = os.path.join(script_dir, '..', 'output', 'artists')
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        if updated_songs:
            updated_file = os.path.join(output_dir, f'updated_artists_{timestamp}.csv')
            df_updated = pd.DataFrame(updated_songs)
            df_updated.to_csv(updated_file, index=False, encoding='utf-8')
            print(f"\n更新成功リスト: {updated_file}")
        
        if not_found_songs:
            not_found_file = os.path.join(output_dir, f'not_found_{timestamp}.csv')
            df_not_found = pd.DataFrame(not_found_songs)
            df_not_found.to_csv(not_found_file, index=False, encoding='utf-8')
            print(f"見つからなかった曲リスト: {not_found_file}")
            print("\n※見つからなかった曲は手動で確認・更新してください")
        
    except Exception as e:
        print(f"\nエラーが発生しました: {e}")
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    print("=" * 60)
    print("Spotify APIを使用したアーティスト情報更新スクリプト")
    print("=" * 60)
    
    try:
        update_artists()
        print("\n✅ スクリプトが正常に完了しました")
    except KeyboardInterrupt:
        print("\n\n⚠️ ユーザーによって中断されました")
    except Exception as e:
        print(f"\n❌ エラー: {e}")
        sys.exit(1)