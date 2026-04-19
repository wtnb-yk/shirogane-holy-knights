#!/usr/bin/env python3
"""
レビュー済み中間CSVを正規化して songs + junction テーブルに反映する。

入力: tools/data-review/extracted_songs_stream.csv or extracted_songs_live.csv（レビュー済み）
参照: songs テーブル（既存曲マスタ）
出力: songs テーブル, stream_songs or concert_songs テーブル

処理:
  - song_title で既存 songs を照合
  - 既存曲 → song_id 再利用
  - 新曲 → UUID 生成、artist は中間CSVの値（なければ 'TODO'）
  - junction テーブルに追加（重複排除）

使い方:
  python3 songs_importer.py stream   # 歌枠
  python3 songs_importer.py live     # ライブ
"""

import csv
import re
import sys
import uuid
from pathlib import Path

from db import get_connection

ROOT = Path(__file__).resolve().parent.parent  # tools/
REVIEW_DIR = ROOT / 'data-review'


def normalize_title(title: str) -> str:
    n = title.lower()
    n = re.sub(r'[　\s]+', '', n)
    n = re.sub(r'[!！?？～〜・♪♫]', '', n)
    n = re.sub(r'[（）()「」『』【】]', '', n)
    return n


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ('stream', 'live'):
        print('使い方: python3 songs_importer.py stream|live')
        sys.exit(1)

    mode = sys.argv[1]
    if mode == 'stream':
        input_file = 'extracted_songs_stream.csv'
        junction_table = 'stream_songs'
    else:
        input_file = 'extracted_songs_live.csv'
        junction_table = 'concert_songs'

    # 中間CSV読み込み（data-review/）
    extracted_path = REVIEW_DIR / input_file
    if not extracted_path.exists():
        print(f'エラー: {extracted_path} が見つかりません')
        sys.exit(1)

    with open(extracted_path, newline='', encoding='utf-8') as f:
        extracted = list(csv.DictReader(f))
    if not extracted:
        print(f'エラー: {extracted_path} が空です')
        sys.exit(1)
    print(f'中間CSV: {len(extracted)}件 ({input_file})')

    conn = get_connection()

    # 既存曲マスタ読み込み
    songs_rows = conn.execute('SELECT id, title FROM songs').fetchall()
    songs_index = {}  # normalized_title → song_id
    for row in songs_rows:
        key = normalize_title(row['title'])
        songs_index[key] = row['id']
    print(f'既存曲マスタ: {len(songs_rows)}件')

    # 既存 junction 件数
    existing_count = conn.execute(f'SELECT COUNT(*) FROM {junction_table}').fetchone()[0]
    print(f'既存 junction: {existing_count}件 ({junction_table})')

    # 正規化・挿入
    new_songs = 0
    junction_added = 0

    conn.execute('BEGIN')
    for row in extracted:
        title = row['song_title']
        artist = row.get('artist', '') or 'TODO'
        key = normalize_title(title)

        song_id = songs_index.get(key)
        if not song_id:
            song_id = str(uuid.uuid4())
            songs_index[key] = song_id
            conn.execute(
                'INSERT INTO songs (id, title, artist) VALUES (?, ?, ?)',
                (song_id, title, artist),
            )
            new_songs += 1

        try:
            conn.execute(
                f'INSERT INTO {junction_table} (song_id, video_id, start_seconds) VALUES (?, ?, ?)',
                (song_id, row['video_id'], int(row['start_seconds'])),
            )
            junction_added += 1
        except Exception:
            pass  # 重複は無視

    conn.execute('COMMIT')

    final_songs = conn.execute('SELECT COUNT(*) FROM songs').fetchone()[0]
    final_junction = conn.execute(f'SELECT COUNT(*) FROM {junction_table}').fetchone()[0]
    conn.close()

    print(f'\nsongs: {final_songs}件, {junction_table}: {final_junction}件')
    print(f'新曲: {new_songs}件, junction追加: {junction_added}件')


if __name__ == '__main__':
    main()
