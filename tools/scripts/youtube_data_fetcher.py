#!/usr/bin/env python3
"""
YouTube Data API から動画データを取得し、既存データとマージして出力する。

既存データ: tools/data/
出力先:     tools/data/

出力CSV（07-csv-design.md 準拠）:
  - channels.csv          id, title, handle, icon_url
  - videos.csv            id, title, thumbnail_url, duration, channel_id, published_at
  - video_video_types.csv video_id, video_type_id
  - stream_details.csv    video_id, started_at

使い方:
  # 全件取得（白銀ノエルch）
  YOUTUBE_API_KEY=xxx python3 youtube_data_fetcher.py

  # 単一動画
  YOUTUBE_API_KEY=xxx python3 youtube_data_fetcher.py <video_id>
"""

import csv
import os
import re
import sys
from pathlib import Path

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

ROOT = Path(__file__).resolve().parent.parent  # tools/
DATA_DIR = ROOT / 'data'

NOEL_CHANNEL_ID = 'UCdyqAaZDKHXg4Ahi7VENThQ'

# video_types.csv: 1=stream, 2=video
VIDEO_TYPE_STREAM = 1
VIDEO_TYPE_VIDEO = 2


# ---------- ユーティリティ ----------

def load_api_key():
    """YOUTUBE_API_KEY を環境変数 → config/.env.local の順で探す。"""
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


def read_csv_keyed(filename, key_field):
    """tools/data/ の CSV を key_field でインデックスした OrderedDict 風 dict で返す。"""
    path = DATA_DIR / filename
    result = {}
    if path.exists():
        with open(path, newline='', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                result[row[key_field]] = row
    return result


def write_csv(filename, fieldnames, rows):
    """data/ に CSV を書き出す。"""
    path = DATA_DIR / filename
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, '') for k in fieldnames})
    print(f'  {filename}: {len(rows)}件')


def load_premiere_ids():
    """プレミア公開動画 ID を set で返す。"""
    path = DATA_DIR / 'premiere_videos.csv'
    ids = set()
    if path.exists():
        with open(path, newline='', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                vid = row.get('video_id', '').strip()
                if vid:
                    ids.add(vid)
        print(f'プレミア公開動画: {len(ids)}件')
    return ids


def iso_duration_to_hhmmss(d):
    """ISO 8601 duration (PT1H30M15S) → HH:MM:SS"""
    h = int(m.group(1)) if (m := re.search(r'(\d+)H', d)) else 0
    mi = int(m.group(1)) if (m := re.search(r'(\d+)M', d)) else 0
    s = int(m.group(1)) if (m := re.search(r'(\d+)S', d)) else 0
    return f'{h:02d}:{mi:02d}:{s:02d}'


def merge(existing, new_rows, key_field):
    """既存データに新データを upsert。既存の並び順を維持し、新規は末尾に追加。"""
    merged = dict(existing)
    for row in new_rows:
        merged[row[key_field]] = row
    return list(merged.values())


# ---------- YouTube API ----------

def fetch_channel_info(youtube, channel_id):
    """チャンネル情報 → channels.csv 形式の dict"""
    resp = youtube.channels().list(
        part='snippet,brandingSettings',
        id=channel_id,
    ).execute()

    if not resp['items']:
        print(f'  警告: チャンネル {channel_id} の情報を取得できませんでした')
        return None

    ch = resp['items'][0]
    snippet = ch['snippet']

    handle = snippet.get('customUrl', '')
    if handle and not handle.startswith('@'):
        handle = '@' + handle

    return {
        'id': ch['id'],
        'title': snippet['title'],
        'handle': handle,
        'icon_url': snippet.get('thumbnails', {}).get('high', {}).get('url', ''),
    }


def fetch_all_video_ids(youtube, channel_id):
    """チャンネルの全動画 ID をリストで返す。"""
    resp = youtube.channels().list(part='contentDetails', id=channel_id).execute()
    if not resp['items']:
        return []

    playlist_id = resp['items'][0]['contentDetails']['relatedPlaylists']['uploads']

    video_ids = []
    page_token = None
    while True:
        resp = youtube.playlistItems().list(
            part='snippet',
            playlistId=playlist_id,
            maxResults=50,
            pageToken=page_token,
        ).execute()

        for item in resp['items']:
            video_ids.append(item['snippet']['resourceId']['videoId'])

        page_token = resp.get('nextPageToken')
        if not page_token:
            break

    print(f'動画ID: {len(video_ids)}件取得')
    return video_ids


def fetch_video_details(youtube, video_ids, channel_id, premiere_ids):
    """動画詳細を取得 → (videos, video_video_types, stream_details) のリスト。"""
    videos = []
    vv_types = []
    stream_details = []

    for i in range(0, len(video_ids), 50):
        batch = video_ids[i : i + 50]
        resp = youtube.videos().list(
            part='snippet,contentDetails,liveStreamingDetails',
            id=','.join(batch),
        ).execute()

        for v in resp['items']:
            vid = v['id']
            snippet = v['snippet']

            is_stream = vid not in premiere_ids and 'liveStreamingDetails' in v
            actual_channel_id = channel_id or snippet['channelId']

            videos.append({
                'id': vid,
                'title': snippet['title'],
                'thumbnail_url': snippet.get('thumbnails', {}).get('high', {}).get('url', ''),
                'duration': iso_duration_to_hhmmss(
                    v.get('contentDetails', {}).get('duration', '')
                ),
                'channel_id': actual_channel_id,
                'published_at': snippet['publishedAt'],
            })

            vv_types.append({
                'video_id': vid,
                'video_type_id': str(VIDEO_TYPE_STREAM if is_stream else VIDEO_TYPE_VIDEO),
            })

            if is_stream:
                live = v['liveStreamingDetails']
                started = live.get('actualStartTime') or live.get('scheduledStartTime')
                if started:
                    stream_details.append({
                        'video_id': vid,
                        'started_at': started,
                    })

    print(f'動画詳細: {len(videos)}件取得')
    return videos, vv_types, stream_details


# ---------- メイン ----------

def main():
    api_key = load_api_key()
    if not api_key:
        print('エラー: YOUTUBE_API_KEY が未設定です')
        print('環境変数に設定するか config/.env.local に記載してください')
        sys.exit(1)

    youtube = build('youtube', 'v3', developerKey=api_key)
    premiere_ids = load_premiere_ids()

    # 既存データ読み込み
    existing_channels = read_csv_keyed('channels.csv', 'id')
    existing_videos = read_csv_keyed('videos.csv', 'id')
    existing_vv_types = read_csv_keyed('video_video_types.csv', 'video_id')
    existing_stream_details = read_csv_keyed('stream_details.csv', 'video_id')

    print(f'既存データ: channels={len(existing_channels)}, videos={len(existing_videos)}')

    # YouTube API からデータ取得
    if len(sys.argv) > 1:
        video_id = sys.argv[1].strip()
        print(f'\n単一動画モード: {video_id}')
        video_ids = [video_id]
        channel_id = None
    else:
        print(f'\n全件モード: {NOEL_CHANNEL_ID}')
        channel_id = NOEL_CHANNEL_ID
        video_ids = fetch_all_video_ids(youtube, channel_id)
        if not video_ids:
            print('動画IDが取得できませんでした')
            sys.exit(1)

    new_videos, new_vv_types, new_stream_details = fetch_video_details(
        youtube, video_ids, channel_id, premiere_ids
    )

    # チャンネル情報取得（新規動画に含まれるチャンネル）
    new_channel_ids = {v['channel_id'] for v in new_videos}
    new_channels = []
    for cid in new_channel_ids:
        info = fetch_channel_info(youtube, cid)
        if info:
            new_channels.append(info)

    # マージ
    channels = merge(existing_channels, new_channels, 'id')
    videos = merge(existing_videos, new_videos, 'id')
    vv_types = merge(existing_vv_types, new_vv_types, 'video_id')
    s_details = merge(existing_stream_details, new_stream_details, 'video_id')

    # 書き出し
    print(f'\n=== data/ に出力 ===')
    write_csv('channels.csv', ['id', 'title', 'handle', 'icon_url'], channels)
    write_csv('videos.csv', ['id', 'title', 'thumbnail_url', 'duration', 'channel_id', 'published_at'], videos)
    write_csv('video_video_types.csv', ['video_id', 'video_type_id'], vv_types)
    write_csv('stream_details.csv', ['video_id', 'started_at'], s_details)

    print('\n完了')


if __name__ == '__main__':
    main()
