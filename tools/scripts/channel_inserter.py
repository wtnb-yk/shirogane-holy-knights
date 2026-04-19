#!/usr/bin/env python3
"""
チャンネルIDを指定して channels テーブルに追加/更新する。

使い方:
  YOUTUBE_API_KEY=xxx python3 channel_inserter.py <CHANNEL_ID> [<CHANNEL_ID> ...]
"""

import os
import sys
from pathlib import Path

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from db import get_connection

ROOT = Path(__file__).resolve().parent.parent  # tools/


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


def fetch_channel(youtube, channel_id):
    """YouTube API からチャンネル情報を取得。"""
    resp = youtube.channels().list(
        part='snippet,brandingSettings',
        id=channel_id,
    ).execute()

    if not resp['items']:
        print(f'  警告: チャンネル {channel_id} が見つかりません')
        return None

    ch = resp['items'][0]
    snippet = ch['snippet']

    handle = snippet.get('customUrl', '')
    if handle and not handle.startswith('@'):
        handle = '@' + handle

    info = {
        'id': ch['id'],
        'title': snippet['title'],
        'handle': handle,
        'icon_url': snippet.get('thumbnails', {}).get('high', {}).get('url', ''),
    }
    print(f'  取得: {info["title"]} ({info["handle"]})')
    return info


def main():
    if len(sys.argv) < 2:
        print('使い方: python3 channel_inserter.py <CHANNEL_ID> [<CHANNEL_ID> ...]')
        sys.exit(1)

    api_key = load_api_key()
    if not api_key:
        print('エラー: YOUTUBE_API_KEY が未設定です')
        sys.exit(1)

    youtube = build('youtube', 'v3', developerKey=api_key)

    conn = get_connection()
    existing_count = conn.execute('SELECT COUNT(*) FROM channels').fetchone()[0]
    print(f'既存チャンネル: {existing_count}件')

    channel_ids = [arg.strip() for arg in sys.argv[1:]]
    print(f'\n{len(channel_ids)}件のチャンネルを取得中...')

    added = 0
    updated = 0
    for cid in channel_ids:
        info = fetch_channel(youtube, cid)
        if info:
            existing = conn.execute(
                'SELECT id FROM channels WHERE id = ?', (cid,)
            ).fetchone()
            if existing:
                updated += 1
            else:
                added += 1
            conn.execute(
                'INSERT OR REPLACE INTO channels (id, title, handle, icon_url) VALUES (?, ?, ?, ?)',
                (info['id'], info['title'], info['handle'], info['icon_url']),
            )

    conn.commit()
    conn.close()

    print(f'\n追加: {added}件, 更新: {updated}件')


if __name__ == '__main__':
    main()
