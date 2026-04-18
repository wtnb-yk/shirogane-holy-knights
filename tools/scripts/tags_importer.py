#!/usr/bin/env python3
"""
レビュー済み中間CSVを video_stream_tags.csv に変換する。

入力: tools/data-review/extracted_tags.csv（レビュー済み）
参照: tools/data/stream_tags.csv（タグマスタ）
      tools/data/video_stream_tags.csv（既存タグ）
出力: tools/data/video_stream_tags.csv

処理:
  - tags 列のタグ名 → tag_id に変換
  - 既存タグとマージ（中間CSVに含まれる動画は上書き、それ以外は維持）

ワークフロー:
  1. just tags          → extracted_tags.csv 出力
  2. [人手レビュー]     → extracted_tags.csv を編集
  3. just tags-import   → video_stream_tags.csv に反映
"""

import csv
import sys
from collections import defaultdict
from pathlib import Path
from typing import Dict

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


def load_tag_name_to_id() -> Dict[str, int]:
    """stream_tags.csv → {tag_name: tag_id}"""
    rows = read_csv_list(DATA_DIR, 'stream_tags.csv')
    return {r['name']: int(r['id']) for r in rows}


def main():
    # タグマスタ読み込み
    name_to_id = load_tag_name_to_id()
    print(f'タグマスタ: {len(name_to_id)}種')

    # 中間CSV読み込み
    extracted = read_csv_list(REVIEW_DIR, 'extracted_tags.csv')
    if not extracted:
        print(f'エラー: {REVIEW_DIR / "extracted_tags.csv"} が見つからないか空です')
        sys.exit(1)
    print(f'中間CSV: {len(extracted)}件')

    # 既存タグ読み込み
    existing_rows = read_csv_list(DATA_DIR, 'video_stream_tags.csv')
    print(f'既存タグ: {len(existing_rows)}件')

    # 中間CSVに含まれる video_id を収集
    reviewed_ids = {row['video_id'] for row in extracted}

    # 既存タグのうち、レビュー対象外の動画のタグを維持
    kept_rows = [r for r in existing_rows if r['video_id'] not in reviewed_ids]

    # 中間CSVからタグ名 → tag_id に変換
    new_rows = []
    errors = []
    for row in extracted:
        vid = row['video_id']
        tags_str = row.get('tags', '').strip()
        if not tags_str:
            continue

        for tag_name in tags_str.split(','):
            tag_name = tag_name.strip()
            if not tag_name:
                continue
            tag_id = name_to_id.get(tag_name)
            if tag_id is None:
                errors.append((vid, tag_name))
                continue
            new_rows.append({'video_id': vid, 'tag_id': str(tag_id)})

    if errors:
        print(f'\n=== 不明なタグ名（{len(errors)}件） ===')
        for vid, name in errors:
            print(f'  {vid}: "{name}"')
        print(f'\n有効なタグ名: {", ".join(sorted(name_to_id.keys()))}')
        sys.exit(1)

    # マージ
    merged = kept_rows + new_rows

    # video_id, tag_id でソート・重複排除
    seen = set()
    deduped = []
    for row in sorted(merged, key=lambda r: (r['video_id'], int(r['tag_id']))):
        key = (row['video_id'], row['tag_id'])
        if key not in seen:
            seen.add(key)
            deduped.append(row)

    print(f'\n=== data/ に出力 ===')
    write_csv('video_stream_tags.csv', ['video_id', 'tag_id'], deduped)

    tagged_videos = len({r['video_id'] for r in new_rows})
    print(f'\nレビュー対象: {len(extracted)}件, タグ付与: {tagged_videos}件, タグなし: {len(extracted) - tagged_videos}件')


if __name__ == '__main__':
    main()
