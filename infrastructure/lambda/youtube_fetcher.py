"""
YouTube Data API から動画データを取得し、SQLite を更新する。
tools/scripts/youtube_data_fetcher.py のコアロジックを Lambda 用に抽出。
"""

import re
import sqlite3

from googleapiclient.discovery import build

NOEL_CHANNEL_ID = 'UCdyqAaZDKHXg4Ahi7VENThQ'

VIDEO_TYPE_STREAM = 1
VIDEO_TYPE_VIDEO = 2


def iso_duration_to_hhmmss(d):
    """ISO 8601 duration (PT1H30M15S) -> HH:MM:SS"""
    h = int(m.group(1)) if (m := re.search(r'(\d+)H', d)) else 0
    mi = int(m.group(1)) if (m := re.search(r'(\d+)M', d)) else 0
    s = int(m.group(1)) if (m := re.search(r'(\d+)S', d)) else 0
    return f'{h:02d}:{mi:02d}:{s:02d}'


def fetch_channel_info(youtube, channel_id):
    resp = youtube.channels().list(
        part='snippet,brandingSettings',
        id=channel_id,
    ).execute()

    if not resp['items']:
        print(f'  Warning: channel {channel_id} not found')
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

    print(f'Video IDs: {len(video_ids)} fetched')
    return video_ids


def fetch_video_details(youtube, video_ids, channel_id, premiere_ids):
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
                'video_type_id': VIDEO_TYPE_STREAM if is_stream else VIDEO_TYPE_VIDEO,
            })

            if is_stream:
                live = v['liveStreamingDetails']
                started = live.get('actualStartTime') or live.get('scheduledStartTime')
                if started:
                    stream_details.append({
                        'video_id': vid,
                        'started_at': started,
                    })

    print(f'Video details: {len(videos)} fetched')
    return videos, vv_types, stream_details


def fetch_and_update(api_key, db_path):
    """YouTube API からデータを取得し DB を更新。更新件数を返す。"""
    youtube = build('youtube', 'v3', developerKey=api_key)

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')

    # Premiere video IDs
    premiere_rows = conn.execute('SELECT video_id FROM premiere_videos').fetchall()
    premiere_ids = {r['video_id'] for r in premiere_rows}

    # Count before update
    count_before = conn.execute('SELECT COUNT(*) FROM videos').fetchone()[0]
    print(f'Videos before: {count_before}')

    # Fetch from YouTube API
    video_ids = fetch_all_video_ids(youtube, NOEL_CHANNEL_ID)
    if not video_ids:
        conn.close()
        return 0

    new_videos, new_vv_types, new_stream_details = fetch_video_details(
        youtube, video_ids, NOEL_CHANNEL_ID, premiere_ids
    )

    # Channel info
    new_channel_ids = {v['channel_id'] for v in new_videos}
    new_channels = []
    for cid in new_channel_ids:
        info = fetch_channel_info(youtube, cid)
        if info:
            new_channels.append(info)

    # Write to DB (upsert)
    conn.execute('BEGIN')

    for ch in new_channels:
        conn.execute(
            '''INSERT INTO channels (id, title, handle, icon_url) VALUES (?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET
                 title=excluded.title, handle=excluded.handle, icon_url=excluded.icon_url''',
            (ch['id'], ch['title'], ch['handle'], ch['icon_url']),
        )

    for v in new_videos:
        conn.execute(
            '''INSERT INTO videos (id, title, thumbnail_url, duration, channel_id, published_at) VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET
                 title=excluded.title, thumbnail_url=excluded.thumbnail_url,
                 duration=excluded.duration, channel_id=excluded.channel_id,
                 published_at=excluded.published_at''',
            (v['id'], v['title'], v['thumbnail_url'], v['duration'], v['channel_id'], v['published_at']),
        )

    for vvt in new_vv_types:
        conn.execute(
            '''INSERT INTO video_video_types (video_id, video_type_id) VALUES (?, ?)
               ON CONFLICT(video_id) DO UPDATE SET
                 video_type_id=excluded.video_type_id''',
            (vvt['video_id'], vvt['video_type_id']),
        )

    for sd in new_stream_details:
        conn.execute(
            '''INSERT INTO stream_details (video_id, started_at) VALUES (?, ?)
               ON CONFLICT(video_id) DO UPDATE SET
                 started_at=excluded.started_at''',
            (sd['video_id'], sd['started_at']),
        )

    conn.execute('COMMIT')

    count_after = conn.execute('SELECT COUNT(*) FROM videos').fetchone()[0]
    conn.close()

    added = count_after - count_before
    print(f'Videos after: {count_after} (added: {added})')
    return added
