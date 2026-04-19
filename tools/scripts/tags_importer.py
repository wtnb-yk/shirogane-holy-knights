#!/usr/bin/env python3
"""
レビュー済み中間CSVを video_stream_tags テーブルに反映する。

入力: tools/data-review/extracted_tags.csv（レビュー済み）
参照: stream_tags テーブル（タグマスタ）
出力: video_stream_tags テーブル

処理:
  - tags 列のタグ名 → tag_id に変換
  - 中間CSVに含まれる動画のタグは上書き、それ以外は維持

ワークフロー:
  1. just tags          → extracted_tags.csv 出力
  2. [人手レビュー]     → extracted_tags.csv を編集
  3. just tags-import   → video_stream_tags に反映
"""

import csv
import sys
from pathlib import Path

from db import get_connection

ROOT = Path(__file__).resolve().parent.parent  # tools/
REVIEW_DIR = ROOT / 'data-review'


def main():
    conn = get_connection()

    # タグマスタ読み込み
    tag_rows = conn.execute('SELECT id, name FROM stream_tags').fetchall()
    name_to_id = {r['name']: r['id'] for r in tag_rows}
    print(f'タグマスタ: {len(name_to_id)}種')

    # 中間CSV読み込み
    extracted_path = REVIEW_DIR / 'extracted_tags.csv'
    if not extracted_path.exists():
        print(f'エラー: {extracted_path} が見つかりません')
        sys.exit(1)

    with open(extracted_path, newline='', encoding='utf-8') as f:
        extracted = list(csv.DictReader(f))
    if not extracted:
        print(f'エラー: {extracted_path} が空です')
        sys.exit(1)
    print(f'中間CSV: {len(extracted)}件')

    # 既存タグ件数
    existing_count = conn.execute('SELECT COUNT(*) FROM video_stream_tags').fetchone()[0]
    print(f'既存タグ: {existing_count}件')

    # 中間CSVに含まれる video_id を収集
    reviewed_ids = {row['video_id'] for row in extracted}

    # タグ名 → tag_id に変換
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
            new_rows.append((vid, tag_id))

    if errors:
        print(f'\n=== 不明なタグ名（{len(errors)}件） ===')
        for vid, name in errors:
            print(f'  {vid}: "{name}"')
        print(f'\n有効なタグ名: {", ".join(sorted(name_to_id.keys()))}')
        conn.close()
        sys.exit(1)

    # トランザクション内でレビュー対象の既存タグを削除 → 新規挿入
    conn.execute('BEGIN')
    for vid in reviewed_ids:
        conn.execute('DELETE FROM video_stream_tags WHERE video_id = ?', (vid,))

    for vid, tag_id in new_rows:
        conn.execute(
            'INSERT OR IGNORE INTO video_stream_tags (video_id, tag_id) VALUES (?, ?)',
            (vid, tag_id),
        )
    conn.execute('COMMIT')

    final_count = conn.execute('SELECT COUNT(*) FROM video_stream_tags').fetchone()[0]
    tagged_videos = len({vid for vid, _ in new_rows})
    conn.close()

    print(f'\nvideo_stream_tags: {final_count}件')
    print(f'レビュー対象: {len(extracted)}件, タグ付与: {tagged_videos}件, タグなし: {len(extracted) - tagged_videos}件')


if __name__ == '__main__':
    main()
