#!/usr/bin/env python3
"""
YouTube コメントから楽曲セットリストを抽出する共通モジュール。

データ取得: tools/data/ の CSV（videos, video_stream_tags, stream_tags）
出力先:     tools/data-staging/
"""

import csv
import os
import re
import time
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Tuple

from googleapiclient.discovery import build

ROOT = Path(__file__).resolve().parent.parent  # tools/
DATA_DIR = ROOT / 'data'
STAGING_DIR = ROOT / 'data-staging'


# ---------- 環境・API ----------

def load_api_key():
    key = os.environ.get('YOUTUBE_API_KEY', '')
    if key:
        return key
    env_file = ROOT / 'config' / '.env.local'
    if env_file.exists():
        for line in env_file.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if line.startswith('YOUTUBE_API_KEY=') and not line.startswith('#'):
                return line.split('=', 1)[1].strip().strip("'\"")
    return ''


def get_youtube_service():
    api_key = load_api_key()
    if not api_key:
        raise ValueError('YOUTUBE_API_KEY が未設定です')
    return build('youtube', 'v3', developerKey=api_key)


# ---------- CSV からの動画リスト取得 ----------

def get_tagged_video_ids(tag_name: str) -> List[Tuple[str, str]]:
    """tools/data/ から指定タグの配信動画リストを取得。(video_id, title) のリスト。"""
    # タグマスタ → tag_name → tag_id
    tag_id = None
    tags_path = DATA_DIR / 'stream_tags.csv'
    with open(tags_path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row['name'] == tag_name:
                tag_id = row['id']
                break
    if tag_id is None:
        print(f'  警告: タグ「{tag_name}」が stream_tags.csv に見つかりません')
        return []

    # video_stream_tags → tag_id でフィルタ → video_id の set
    tagged_ids = set()
    vst_path = DATA_DIR / 'video_stream_tags.csv'
    with open(vst_path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row['tag_id'] == tag_id:
                tagged_ids.add(row['video_id'])

    # videos → タイトル取得、published_at 降順でソート
    videos = []
    vid_path = DATA_DIR / 'videos.csv'
    with open(vid_path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row['id'] in tagged_ids:
                videos.append((row['id'], row['title'], row['published_at']))

    videos.sort(key=lambda x: x[2], reverse=True)
    return [(vid, title) for vid, title, _ in videos]


# ---------- YouTube コメント解析 ----------

def get_video_comments(youtube, video_id: str, max_results: int = 100) -> List[Dict]:
    comments = []
    request = youtube.commentThreads().list(
        part='snippet',
        videoId=video_id,
        maxResults=max_results,
        order='relevance',
    )
    try:
        response = request.execute()
        for item in response['items']:
            comment = item['snippet']['topLevelComment']['snippet']
            comments.append({
                'text': comment['textDisplay'],
                'author': comment['authorDisplayName'],
                'likes': comment['likeCount'],
            })
    except Exception as e:
        print(f'  コメント取得エラー ({video_id}): {e}')
    return comments


def parse_timestamp(ts: str) -> int:
    parts = ts.strip().split(':')
    if len(parts) == 2:
        m, s = map(int, parts)
        return m * 60 + s
    elif len(parts) == 3:
        h, m, s = map(int, parts)
        return h * 3600 + m * 60 + s
    return 0


def extract_songs_from_comment(text: str) -> List[Tuple[str, str, int]]:
    """コメントからタイムスタンプと曲情報を抽出。(title, artist, seconds) のリスト。"""
    text = re.sub(r'<[^>]+>', '', text)

    ts_pat = r'(\d{1,2}:\d{2}(?::\d{2})?)'
    matches = re.findall(
        f'{ts_pat}\\s*(?:\\d+\\.?)?\\s*(.+?)(?=(?:\\d{{1,2}}:\\d{{2}})|$)',
        text, re.MULTILINE | re.DOTALL,
    )

    songs = []
    skip_patterns = [
        r'^(MC|EN|opening|start|挨拶|お手紙|♫|🎵)',
        r'(チャンネル登録|カウンター|音量調整)',
        r'(団長|ドラマ|アレルギー|食べた|語っている|気付く|やりたいこと)',
        r'^(教師|高校生|結婚できない|占い)',
        r'「.*」',
        r'○',
        r'^\([^)]+\)',
        r'^(見ていない|に似てる|ですか)',
        r'の熱帯夜',
    ]

    for ts_str, song_info in matches:
        song_info = re.sub(r'\s+', ' ', song_info.strip())
        if not song_info:
            continue

        artist_match = re.match(r'(.+?)\s*[/／\-－]\s*(.+)', song_info)
        if artist_match:
            title = artist_match.group(1).strip()
            artist = artist_match.group(2).strip()
        else:
            title = song_info
            artist = ''

        title = re.sub(r'^\d+\.\s*', '', title)
        title = re.sub(r'^0?\d\s*曲目[:：]\s*', '', title)

        if any(re.search(p, title, re.IGNORECASE) for p in skip_patterns):
            continue

        seconds = parse_timestamp(ts_str)
        if title and len(title) > 2:
            songs.append((title, artist, seconds))

    return songs


# ---------- メイン処理 ----------

def process_videos(youtube, videos: List[Tuple[str, str]], output_filename: str, tag_name: str):
    """動画リストを処理して data-staging/ に CSV 出力。"""
    STAGING_DIR.mkdir(parents=True, exist_ok=True)
    output_path = STAGING_DIR / output_filename

    fieldnames = [
        'video_id', 'video_url_with_timestamp', 'video_title', 'video_url',
        'song_title', 'artist', 'start_time', 'start_seconds',
    ]

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for i, (video_id, video_title) in enumerate(videos, 1):
            print(f'  ({i}/{len(videos)}) {video_title[:50]} ({video_id})')

            comments = get_video_comments(youtube, video_id)
            print(f'    コメント: {len(comments)}件')

            best_setlist = []
            best_likes = 0
            for c in comments:
                songs = extract_songs_from_comment(c['text'])
                if songs and (
                    len(songs) > len(best_setlist)
                    or (len(songs) == len(best_setlist) and c['likes'] > best_likes)
                ):
                    best_setlist = songs
                    best_likes = c['likes']

            if best_setlist:
                print(f'    抽出: {len(best_setlist)}曲 (いいね: {best_likes})')
                for title, artist, seconds in best_setlist:
                    m, s = divmod(seconds, 60)
                    writer.writerow({
                        'video_id': video_id,
                        'video_url_with_timestamp': f'https://www.youtube.com/watch?v={video_id}&t={seconds}s',
                        'video_title': video_title,
                        'video_url': f'https://www.youtube.com/watch?v={video_id}',
                        'song_title': title,
                        'artist': artist,
                        'start_time': f'{m:02d}:{s:02d}',
                        'start_seconds': seconds,
                    })
            else:
                print(f'    セットリスト未検出')

            time.sleep(1)

    print(f'\n  {output_path.name} に保存')
