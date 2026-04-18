#!/usr/bin/env python3
"""
YouTube コメントから楽曲セットリストを抽出し、正規化CSVを出力する。

データ取得: tools/data/ の CSV
出力先:     tools/data-staging/
  - songs.csv              既存 + 新曲（UUID付き）
  - stream_songs.csv       歌枠の junction
  - concert_songs.csv      ライブの junction
  - extracted_songs_*.csv   フラット（確認用）
"""

import csv
import os
import re
import time
import uuid
from pathlib import Path
from typing import Dict, List, Optional, Tuple

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


# ---------- CSV 読み書き ----------

def read_csv_list(filename):
    path = DATA_DIR / filename
    if not path.exists():
        return []
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def write_csv(filename, fieldnames, rows):
    STAGING_DIR.mkdir(parents=True, exist_ok=True)
    path = STAGING_DIR / filename
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, '') for k in fieldnames})
    print(f'  {filename}: {len(rows)}件')


# ---------- CSV からの動画リスト取得 ----------

def get_tagged_video_ids(tag_name: str) -> List[Tuple[str, str]]:
    """tools/data/ から指定タグの配信動画リストを取得。(video_id, title) のリスト。"""
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

    tagged_ids = set()
    vst_path = DATA_DIR / 'video_stream_tags.csv'
    with open(vst_path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row['tag_id'] == tag_id:
                tagged_ids.add(row['video_id'])

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


# ---------- 抽出処理 ----------

def extract_from_videos(youtube, videos: List[Tuple[str, str]]) -> List[Dict]:
    """動画リストからセットリストを抽出。フラットな dict のリストを返す。"""
    results = []

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
                results.append({
                    'video_id': video_id,
                    'video_title': video_title,
                    'song_title': title,
                    'artist': artist,
                    'start_seconds': seconds,
                })
        else:
            print(f'    セットリスト未検出')

        time.sleep(1)

    return results


# ---------- 正規化・出力 ----------

def _normalize_title(title: str) -> str:
    """曲名照合用の正規化。"""
    n = title.lower()
    n = re.sub(r'[　\s]+', '', n)
    n = re.sub(r'[!！?？～〜・♪♫]', '', n)
    n = re.sub(r'[（）()「」『』【】]', '', n)
    return n


def load_songs_master() -> Tuple[List[Dict], Dict[str, str]]:
    """既存 songs.csv を読み込み。(行リスト, {normalized_title: song_id}) を返す。"""
    rows = read_csv_list('songs.csv')
    index = {}
    for row in rows:
        key = _normalize_title(row['title'])
        index[key] = row['id']
    return rows, index


def normalize_and_save(
    extracted: List[Dict],
    junction_filename: str,
    flat_filename: str,
    songs_master: List[Dict],
    songs_index: Dict[str, str],
):
    """抽出結果を正規化して出力。songs_master と songs_index はその場で更新される。"""
    STAGING_DIR.mkdir(parents=True, exist_ok=True)

    # フラット CSV（確認用）
    flat_fields = [
        'video_id', 'video_url_with_timestamp', 'video_title', 'video_url',
        'song_title', 'artist', 'start_time', 'start_seconds',
    ]
    flat_rows = []
    for r in extracted:
        m, s = divmod(r['start_seconds'], 60)
        flat_rows.append({
            'video_id': r['video_id'],
            'video_url_with_timestamp': f"https://www.youtube.com/watch?v={r['video_id']}&t={r['start_seconds']}s",
            'video_title': r['video_title'],
            'video_url': f"https://www.youtube.com/watch?v={r['video_id']}",
            'song_title': r['song_title'],
            'artist': r['artist'],
            'start_time': f'{m:02d}:{s:02d}',
            'start_seconds': r['start_seconds'],
        })
    write_csv(flat_filename, flat_fields, flat_rows)

    # 正規化: 曲名照合 → song_id 解決
    junction_rows = []
    new_songs = 0
    for r in extracted:
        key = _normalize_title(r['song_title'])
        song_id = songs_index.get(key)

        if not song_id:
            # 新曲 → UUID 生成
            song_id = str(uuid.uuid4())
            songs_index[key] = song_id
            songs_master.append({
                'id': song_id,
                'title': r['song_title'],
                'artist': r['artist'] or 'TODO',
            })
            new_songs += 1

        junction_rows.append({
            'song_id': song_id,
            'video_id': r['video_id'],
            'start_seconds': str(r['start_seconds']),
        })

    # 既存の junction とマージ（既存キー: song_id + video_id + start_seconds）
    existing_junction = read_csv_list(junction_filename)
    existing_keys = {
        (row['song_id'], row['video_id'], row['start_seconds'])
        for row in existing_junction
    }
    merged_junction = list(existing_junction)
    added = 0
    for row in junction_rows:
        key = (row['song_id'], row['video_id'], row['start_seconds'])
        if key not in existing_keys:
            merged_junction.append(row)
            existing_keys.add(key)
            added += 1

    write_csv(junction_filename, ['song_id', 'video_id', 'start_seconds'], merged_junction)
    print(f'    新曲: {new_songs}件, junction追加: {added}件')
