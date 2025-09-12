#!/usr/bin/env python3
import os
import re
import csv
import psycopg2
from googleapiclient.discovery import build
from typing import List, Dict, Tuple
import time
from pathlib import Path

def load_env_file(env_path: str):
    """環境設定ファイルを読み込む"""
    if not os.path.exists(env_path):
        return
    
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                if '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

def get_youtube_service():
    """YouTube APIサービスを初期化"""
    config_dir = Path(__file__).parent.parent / 'config'
    env_file = config_dir / '.env.local'
    load_env_file(str(env_file))
    
    api_key = os.environ.get('YOUTUBE_API_KEY')
    if not api_key:
        raise ValueError("YOUTUBE_API_KEYが設定されていません")
    return build('youtube', 'v3', developerKey=api_key)

def get_video_comments(youtube, video_id: str, max_results: int = 100) -> List[Dict]:
    """動画のコメントを取得"""
    comments = []
    request = youtube.commentThreads().list(
        part='snippet',
        videoId=video_id,
        maxResults=max_results,
        order='relevance'
    )
    
    try:
        response = request.execute()
        for item in response['items']:
            comment = item['snippet']['topLevelComment']['snippet']
            comments.append({
                'text': comment['textDisplay'],
                'author': comment['authorDisplayName'],
                'likes': comment['likeCount']
            })
    except Exception as e:
        print(f"動画 {video_id} のコメント取得エラー: {e}")
    
    return comments

def parse_timestamp(timestamp_str: str) -> int:
    """タイムスタンプを秒数に変換"""
    parts = timestamp_str.strip().split(':')
    if len(parts) == 2:
        minutes, seconds = map(int, parts)
        return minutes * 60 + seconds
    elif len(parts) == 3:
        hours, minutes, seconds = map(int, parts)
        return hours * 3600 + minutes * 60 + seconds
    return 0

def extract_songs_from_comment(comment_text: str) -> List[Tuple[str, str, int]]:
    """コメントからタイムスタンプと曲情報を抽出"""
    songs = []
    
    # HTMLタグを除去
    comment_text = re.sub(r'<[^>]+>', '', comment_text)
    
    # タイムスタンプパターン: 00:00 or 0:00:00 or 00:00:00
    timestamp_pattern = r'(\d{1,2}:\d{2}(?::\d{2})?)'
    
    # 複数行にまたがるセットリストを処理
    # パターン1: タイムスタンプ + 曲番号 + 曲名
    pattern1 = re.findall(f'{timestamp_pattern}\\s*(?:\\d+\\.?)?\\s*(.+?)(?=(?:\\d{{1,2}}:\\d{{2}})|$)', comment_text, re.MULTILINE | re.DOTALL)
    
    for timestamp_str, song_info in pattern1:
        song_info = song_info.strip()
        if not song_info:
            continue
            
        # 改行や余分な空白を除去
        song_info = re.sub(r'\s+', ' ', song_info)
        
        # 曲名とアーティストを分離
        # パターン: "曲名 / アーティスト" または "曲名 - アーティスト"
        artist_match = re.match(r'(.+?)\s*[/／\-－]\s*(.+)', song_info)
        if artist_match:
            song_title = artist_match.group(1).strip()
            artist = artist_match.group(2).strip()
        else:
            song_title = song_info
            artist = ""
        
        # 曲番号の除去
        song_title = re.sub(r'^\d+\.\s*', '', song_title)
        song_title = re.sub(r'^0?\d\s*曲目[:：]\s*', '', song_title)
        
        # MCや不要な情報をスキップ
        skip_patterns = [
            r'^(MC|EN|opening|start|挨拶|お手紙|♫|🎵)',
            r'(チャンネル登録|カウンター|音量調整)',
            r'(団長|ドラマ|アレルギー|食べた|語っている|気付く|やりたいこと)',
            r'^(教師|高校生|結婚できない|占い)',
            r'「.*」',  # 引用符で囲まれたコメント
            r'○',      # 記号のみ
            r'^\([^)]+\)',  # 括弧で囲まれた説明
            r'^(見ていない|に似てる|ですか)',
            r'の熱帯夜'
        ]
        
        skip = False
        for pattern in skip_patterns:
            if re.search(pattern, song_title, re.IGNORECASE):
                skip = True
                break
        
        if skip:
            continue
        
        seconds = parse_timestamp(timestamp_str)
        if song_title and len(song_title) > 2:  # 短すぎるタイトルを除外
            songs.append((song_title, artist, seconds))
    
    return songs

def get_stream_videos_from_db(tag_name: str) -> List[Tuple[str, str]]:
    """DBから指定されたタグの動画リストを取得"""
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="shirogane",
        user="postgres",
        password="postgres"
    )
    
    cur = conn.cursor()
    query = """
        SELECT v.id, v.title
        FROM videos v
        INNER JOIN video_video_types vvt ON vvt.video_id = v.id
        INNER JOIN video_types vt ON vt.id = vvt.video_type_id AND vt.type = 'stream'
        INNER JOIN video_stream_tags vst ON vst.video_id = v.id
        INNER JOIN stream_tags st ON st.id = vst.tag_id AND st.name = %s
        ORDER BY published_at DESC
    """
    
    cur.execute(query, (tag_name,))
    videos = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return videos

def process_videos_and_save_to_csv(youtube, videos: List[Tuple[str, str]], csv_filename: str, tag_name: str):
    """動画リストを処理してCSVに保存"""
    with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['video_id', 'video_url_with_timestamp', 'video_title', 'video_url', 'song_title', 'artist', 'start_time', 'start_seconds']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        # 各動画のコメントから曲情報を抽出
        for i, (video_id, video_title) in enumerate(videos, 1):
            print(f"\n処理中 ({i}/{len(videos)}): {video_title} ({video_id})")
            
            # コメント取得
            comments = get_video_comments(youtube, video_id)
            print(f"  {len(comments)}件のコメントを取得")
            
            # タイムスタンプ付きコメントを探す
            best_setlist = []
            best_likes = 0
            
            for comment in comments:
                songs = extract_songs_from_comment(comment['text'])
                if songs and len(songs) > len(best_setlist):
                    # より多くの曲を含むセットリストを優先
                    best_setlist = songs
                    best_likes = comment['likes']
                elif songs and len(songs) == len(best_setlist) and comment['likes'] > best_likes:
                    # 同じ曲数ならいいね数が多い方を優先
                    best_setlist = songs
                    best_likes = comment['likes']
            
            if best_setlist:
                print(f"  {len(best_setlist)}曲を抽出（いいね数: {best_likes}）")
                
                # CSVに書き込み
                for song_title, artist, seconds in best_setlist:
                    # 秒数を MM:SS 形式に変換
                    minutes = seconds // 60
                    secs = seconds % 60
                    start_time = f"{minutes:02d}:{secs:02d}"
                    
                    writer.writerow({
                        'video_id': video_id,
                        'video_url_with_timestamp': f'https://www.youtube.com/watch?v={video_id}&t={seconds}s',
                        'video_title': video_title,
                        'video_url': f'https://www.youtube.com/watch?v={video_id}',
                        'song_title': song_title,
                        'artist': artist,
                        'start_time': start_time,
                        'start_seconds': seconds
                    })
            else:
                print(f"  タイムスタンプ付きコメントが見つかりませんでした")
            
            # API制限を避けるため少し待機
            time.sleep(1)
    
    print(f"\n{tag_name}の抽出完了！結果を {csv_filename} に保存しました")