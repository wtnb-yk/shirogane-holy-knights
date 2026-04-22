#!/usr/bin/env python3
"""
CSVから music_videos テーブルにデータを反映する。

入力: tools/data-review/music_videos.csv
  列: song_title, video_id, type (original|cover)

処理:
  - song_title で既存 songs を照合（正規化マッチ）
  - 既存曲 → song_id 再利用
  - 新曲 → UUID 生成、artist='TODO' で songs に追加
  - music_videos テーブルに挿入（重複は無視）

使い方:
  python3 music_videos_importer.py
"""

import csv
import re
import sys
import uuid
from pathlib import Path

from db import get_connection

ROOT = Path(__file__).resolve().parent.parent  # tools/
REVIEW_DIR = ROOT / 'data-review'

TYPE_MAP = {
    'original': 1,
    'cover': 2,
}


def normalize_title(title: str) -> str:
    n = title.lower()
    n = re.sub(r'[　\s]+', '', n)
    n = re.sub(r'[!！?？～〜・♪♫]', '', n)
    n = re.sub(r'[（）()「」『』【】]', '', n)
    return n


def main():
    csv_path = REVIEW_DIR / 'music_videos.csv'
    if not csv_path.exists():
        print(f'エラー: {csv_path} が見つかりません')
        sys.exit(1)

    with open(csv_path, newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    if not rows:
        print(f'エラー: {csv_path} が空です')
        sys.exit(1)
    print(f'入力CSV: {len(rows)}件')

    # type 列の検証
    for i, row in enumerate(rows, 1):
        t = row.get('type', '').strip()
        if t not in TYPE_MAP:
            print(f'エラー: {i}行目の type が不正です: "{t}" (original|cover のいずれか)')
            sys.exit(1)

    conn = get_connection()

    # 既存曲マスタ読み込み
    songs_rows = conn.execute('SELECT id, title FROM songs').fetchall()
    songs_index = {}  # normalized_title → (song_id, original_title)
    for s in songs_rows:
        key = normalize_title(s['title'])
        songs_index[key] = (s['id'], s['title'])
    print(f'既存曲マスタ: {len(songs_rows)}件')

    # 既存 music_videos 件数
    existing_count = conn.execute('SELECT COUNT(*) FROM music_videos').fetchone()[0]
    print(f'既存 music_videos: {existing_count}件')

    # videos テーブルに存在する video_id を取得（検証用）
    video_ids_in_db = {
        r[0] for r in conn.execute('SELECT id FROM videos').fetchall()
    }

    # 挿入処理
    new_songs = 0
    added = 0
    skipped = 0
    missing_videos = []

    conn.execute('BEGIN')
    for row in rows:
        title = row['song_title'].strip()
        video_id = row['video_id'].strip()
        mv_type = row['type'].strip()

        # video_id が videos テーブルに存在するか確認
        if video_id not in video_ids_in_db:
            missing_videos.append((title, video_id))
            continue

        # 楽曲の照合
        key = normalize_title(title)
        match = songs_index.get(key)
        if match:
            song_id = match[0]
        else:
            song_id = str(uuid.uuid4())
            songs_index[key] = (song_id, title)
            conn.execute(
                'INSERT INTO songs (id, title, artist) VALUES (?, ?, ?)',
                (song_id, title, 'TODO'),
            )
            new_songs += 1

        try:
            conn.execute(
                'INSERT INTO music_videos (song_id, video_id, music_video_type_id) VALUES (?, ?, ?)',
                (song_id, video_id, TYPE_MAP[mv_type]),
            )
            added += 1
        except Exception:
            skipped += 1  # 重複

    conn.execute('COMMIT')

    if missing_videos:
        print(f'\n=== videos テーブルに存在しない video_id（{len(missing_videos)}件） ===')
        for title, vid in missing_videos:
            print(f'  {title}: {vid}')
        print('先に youtube_data_fetcher.py で動画データを取得してください')

    final_count = conn.execute('SELECT COUNT(*) FROM music_videos').fetchone()[0]
    conn.close()

    print(f'\nmusic_videos: {existing_count}件 → {final_count}件')
    print(f'追加: {added}件, 重複スキップ: {skipped}件, 新曲作成: {new_songs}件')


if __name__ == '__main__':
    main()
