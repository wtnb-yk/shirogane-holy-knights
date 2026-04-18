#!/usr/bin/env python3
"""
レビュー済み中間CSVを正規化CSVに変換する。

入力: tools/data-review/extracted_songs_stream.csv or extracted_songs_live.csv（レビュー済み）
参照: tools/data/songs.csv（既存曲マスタ）
出力: tools/data/songs.csv, tools/data/stream_songs.csv or concert_songs.csv

処理:
  - song_title で既存 songs.csv を照合
  - 既存曲 → song_id 再利用
  - 新曲 → UUID 生成、artist は中間CSVの値（なければ 'TODO'）
  - junction テーブル（song_id, video_id, start_seconds）を生成
  - 既存 junction とマージ（重複排除）

使い方:
  python3 songs_importer.py stream   # 歌枠
  python3 songs_importer.py live     # ライブ
"""

import csv
import re
import sys
import uuid
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parent.parent  # tools/
DATA_DIR = ROOT / 'data'
REVIEW_DIR = ROOT / 'data-review'


def read_csv_list(directory, filename):
    path = directory / filename
    if not path.exists():
        return []
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def write_csv(filename, fieldnames, rows):
    path = DATA_DIR / filename
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, '') for k in fieldnames})
    print(f'  {filename}: {len(rows)}件')


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
        junction_file = 'stream_songs.csv'
    else:
        input_file = 'extracted_songs_live.csv'
        junction_file = 'concert_songs.csv'

    # 中間CSV読み込み（data-review/）
    extracted = read_csv_list(REVIEW_DIR, input_file)
    if not extracted:
        print(f'エラー: {REVIEW_DIR / input_file} が見つからないか空です')
        sys.exit(1)
    print(f'中間CSV: {len(extracted)}件 ({input_file})')

    # 既存曲マスタ読み込み
    songs_master = read_csv_list(DATA_DIR, 'songs.csv')
    songs_index = {}  # normalized_title → song_id
    for row in songs_master:
        key = normalize_title(row['title'])
        songs_index[key] = row['id']
    print(f'既存曲マスタ: {len(songs_master)}件')

    # 既存 junction 読み込み
    existing_junction = read_csv_list(DATA_DIR, junction_file)
    existing_keys = {
        (row['song_id'], row['video_id'], row['start_seconds'])
        for row in existing_junction
    }
    print(f'既存 junction: {len(existing_junction)}件 ({junction_file})')

    # 正規化
    new_songs = 0
    junction_rows = list(existing_junction)
    junction_added = 0

    for row in extracted:
        title = row['song_title']
        artist = row.get('artist', '') or 'TODO'
        key = normalize_title(title)

        song_id = songs_index.get(key)
        if not song_id:
            song_id = str(uuid.uuid4())
            songs_index[key] = song_id
            songs_master.append({
                'id': song_id,
                'title': title,
                'artist': artist,
            })
            new_songs += 1

        junction_row = {
            'song_id': song_id,
            'video_id': row['video_id'],
            'start_seconds': row['start_seconds'],
        }
        junction_key = (song_id, row['video_id'], row['start_seconds'])
        if junction_key not in existing_keys:
            junction_rows.append(junction_row)
            existing_keys.add(junction_key)
            junction_added += 1

    # 出力
    print(f'\n=== data/ に出力 ===')
    write_csv('songs.csv', ['id', 'title', 'artist'], songs_master)
    write_csv(junction_file, ['song_id', 'video_id', 'start_seconds'], junction_rows)
    print(f'\n新曲: {new_songs}件, junction追加: {junction_added}件')


if __name__ == '__main__':
    main()
