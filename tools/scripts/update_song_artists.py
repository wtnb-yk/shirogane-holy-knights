#!/usr/bin/env python3
"""
Spotify API で songs テーブルのアーティスト情報を補完する。

対象: artist が 'TODO' の曲
出力: songs テーブルを直接更新

使い方:
  python3 update_song_artists.py
"""

import os
import re
import sys
import time
from pathlib import Path

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from db import get_connection

ROOT = Path(__file__).resolve().parent.parent  # tools/


# ---------- 環境・API ----------

def load_env():
    env_file = ROOT / 'config' / '.env.local'
    if env_file.exists():
        for line in env_file.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip())


def init_spotify():
    client_id = os.environ.get('SPOTIFY_CLIENT_ID')
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
    if not client_id or not client_secret:
        print('エラー: SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET が未設定です')
        sys.exit(1)
    auth = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    return spotipy.Spotify(auth_manager=auth, language='ja')


# ---------- Spotify 検索 ----------

def normalize_title(title):
    n = title.lower()
    n = re.sub(r'[　\s]+', '', n)
    n = re.sub(r'[!！?？～〜・]', '', n)
    n = re.sub(r'[（）()「」『』【】]', '', n)
    return n


def search_artist(sp, song_title):
    """Spotify API で曲名からアーティストを検索。(artist_name, spotify_title) or (None, None)"""
    try:
        results = sp.search(q=song_title, type='track', limit=20, market='JP')
        if not results['tracks']['items']:
            results = sp.search(q=song_title, type='track', limit=20)
            if not results['tracks']['items']:
                return None, None

        normalized_search = normalize_title(song_title)

        exact = []
        partial = []
        for track in results['tracks']['items']:
            nt = normalize_title(track['name'])
            if nt == normalized_search:
                exact.append(track)
            elif normalized_search in nt or nt in normalized_search or song_title.lower() in track['name'].lower():
                partial.append(track)

        candidates = exact or partial[:10] or results['tracks']['items'][:5]

        for track in candidates:
            artist_name = ', '.join(a['name'] for a in track['artists'])
            if '白銀ノエル' in artist_name:
                return artist_name, track['name']

        def score(track):
            s = track['popularity']
            nt = normalize_title(track['name'])
            if nt == normalized_search:
                s += 100
            rd = track['album']['release_date']
            if rd and len(rd) >= 4:
                try:
                    year = int(rd[:4])
                    if 1970 <= year <= 2026:
                        s += (2026 - year) * 1.5
                except ValueError:
                    pass
            at = track['album']['album_type']
            if at == 'album':
                s += 30
            elif at == 'single':
                s += 20
            elif at == 'compilation':
                s -= 10
            an = track['artists'][0]['name']
            if re.search(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]', an):
                s += 40
            tn = track['name'].lower()
            anl = an.lower()
            cover_kw = ['cv.', 'cv：', 'starring', 'feat.', 'cover', 'カバー',
                        'live', 'ライブ', 'remix', 'リミックス', 'remaster']
            if any(k in tn or k in anl for k in cover_kw):
                s -= 50
            return s

        best = max(candidates, key=score)
        return ', '.join(a['name'] for a in best['artists']), best['name']

    except Exception as e:
        print(f'  Spotify検索エラー ({song_title}): {e}')
        return None, None


# ---------- メイン ----------

def main():
    load_env()
    sp = init_spotify()
    print('Spotify API 接続OK')

    conn = get_connection()
    total = conn.execute('SELECT COUNT(*) FROM songs').fetchone()[0]
    todo_rows = conn.execute(
        "SELECT id, title FROM songs WHERE artist = 'TODO'"
    ).fetchall()
    print(f'全曲: {total}件, TODO: {len(todo_rows)}件\n')

    if not todo_rows:
        print('更新対象の曲がありません')
        conn.close()
        return

    updated = 0
    not_found = 0
    for i, row in enumerate(todo_rows, 1):
        artist, spotify_title = search_artist(sp, row['title'])
        if artist:
            conn.execute(
                'UPDATE songs SET artist = ? WHERE id = ?',
                (artist, row['id']),
            )
            updated += 1
            print(f'  [{i}/{len(todo_rows)}] {row["title"][:30]:<30} → {artist}')
        else:
            not_found += 1
            print(f'  [{i}/{len(todo_rows)}] {row["title"][:30]:<30} → 未検出')
        time.sleep(0.1)

    conn.commit()
    conn.close()

    print(f'\n更新: {updated}件, 未検出: {not_found}件')


if __name__ == '__main__':
    main()
