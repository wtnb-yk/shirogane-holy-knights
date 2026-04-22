#!/usr/bin/env python3
"""
配信タイトルからタグを自動判定し、人間がレビューする中間CSVを出力する。

既存データ: web/data/danin-log.db
出力先:     tools/data-review/extracted_tags.csv（中間CSV）

キーワードルール: tag_keywords テーブル（DB駆動）
特殊ルール:       コード内（雑談/ゲーム/企画/記念/ライブの5タグ）

モード:
  通常:   新着（未分類）のみ分類 → 中間CSV出力（人手レビュー用）
  --all:  全件再分類 → 中間CSV出力
  --verify: 全件再分類 → 人手タグとの精度レポート

ワークフロー:
  1. just tags          → extracted_tags.csv 出力
  2. [人手レビュー]     → extracted_tags.csv を編集
  3. just tags-import   → video_stream_tags に反映
"""

import argparse
import csv
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set

from db import get_readonly_connection

ROOT = Path(__file__).resolve().parent.parent  # tools/
REVIEW_DIR = ROOT / 'data-review'


# ---------- データ読み込み ----------

def load_tag_master(conn) -> Dict[int, str]:
    """stream_tags → {tag_id: tag_name}"""
    rows = conn.execute('SELECT id, name FROM stream_tags').fetchall()
    return {r['id']: r['name'] for r in rows}


def load_tag_keywords(conn) -> Dict[int, List[str]]:
    """tag_keywords → {tag_id: [keyword, ...]}"""
    rows = conn.execute('SELECT tag_id, keyword FROM tag_keywords').fetchall()
    result = defaultdict(list)
    for r in rows:
        result[r['tag_id']].append(r['keyword'])
    return dict(result)


def load_stream_data(conn):
    """配信データを読み込み → {video_id: {title, duration, started_at}}"""
    rows = conn.execute("""
        SELECT v.id, v.title, v.duration,
               COALESCE(sd.started_at, v.published_at) AS started_at
        FROM videos v
        JOIN video_video_types vvt ON v.id = vvt.video_id
        JOIN video_types vt ON vvt.video_type_id = vt.id
        LEFT JOIN stream_details sd ON v.id = sd.video_id
        WHERE vt.type = 'stream'
          AND v.id NOT IN (SELECT video_id FROM hidden_streams)
    """).fetchall()

    return {r['id']: {
        'title': r['title'],
        'duration': r['duration'],
        'started_at': r['started_at'],
    } for r in rows}


def load_existing_tags(conn) -> Dict[str, Set[int]]:
    """video_stream_tags → {video_id: {tag_id, ...}}"""
    rows = conn.execute('SELECT video_id, tag_id FROM video_stream_tags').fetchall()
    result = defaultdict(set)
    for r in rows:
        result[r['video_id']].add(r['tag_id'])
    return dict(result)


def load_published_at_map(conn) -> Dict[str, str]:
    """videos → {video_id: published_at}"""
    rows = conn.execute('SELECT id, published_at FROM videos').fetchall()
    return {r['id']: r['published_at'] for r in rows}


# ---------- 分類エンジン ----------

def extract_time_features(started_at: Optional[str]) -> Dict:
    if not started_at:
        return {}
    try:
        dt = datetime.fromisoformat(str(started_at).replace('Z', '+00:00'))
        return {'hour': dt.hour, 'is_morning': 0 <= dt.hour < 12}
    except Exception:
        return {}


def classify(title: str, duration: Optional[str], started_at: Optional[str],
             tag_master: Dict[int, str], tag_keywords: Dict[int, List[str]]) -> Set[int]:
    """タグ判定。キーワードCSV + 特殊ルール + フォールバックの3段構成。"""
    matched: Set[int] = set()

    # --- Phase 1: キーワードマッチ（DB駆動） ---
    for tag_id, keywords in tag_keywords.items():
        if any(kw in title for kw in keywords):
            matched.add(tag_id)

    # --- Phase 2: 特殊ルール ---
    time_feat = extract_time_features(started_at)

    # 雑談(1): 朝(0-12時) × 朝キーワード
    if 1 not in matched:
        if time_feat.get('is_morning', False) and 'おは' in title:
            matched.add(1)

    # ゲーム(2): #数字（エピソード番号）。#数字の直後に非数字文字が続く場合は除外（#3期生 等）
    if 2 not in matched:
        if re.search(r'#\d+(?=[\s【\]】]|$)', title):
            matched.add(2)

    # 記念(8): マイルストーンパターン（ただし耐久/歌枠タイトルは除外）
    if 8 not in matched:
        if re.search(r'\d+周年|\d+万人|\d+日記念', title):
            exclude_kw = ['耐久', '歌枠', 'まで歌']
            if not any(k in title for k in exclude_kw):
                matched.add(8)

    # ライブ(14): タイトル全体で 3D LIVE 系 or 生誕LIVE 系（除外条件あり）
    if 14 not in matched:
        live_pattern = r'3D\s*LIVE|3D\s*ライブ|3DLIVE|生誕.*LIVE|Birthday.*Live|Anniversary.*LIVE'
        if re.search(live_pattern, title, re.IGNORECASE):
            exclude_kw = ['雑談', 'お礼', 'スパチャ', '告知', 'お知らせ', '朝活', '感想会', '振り返り']
            if not any(k in title for k in exclude_kw):
                matched.add(14)

    return matched


# ---------- 中間CSV出力 ----------

def write_extracted_tags(rows):
    """中間CSV（extracted_tags.csv）を data-review/ に出力。"""
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    path = REVIEW_DIR / 'extracted_tags.csv'
    fieldnames = ['video_id', 'video_title', 'published_at', 'tags']
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, '') for k in fieldnames})
    print(f'  extracted_tags.csv: {len(rows)}件')


def run_normal(conn, tag_master, tag_keywords):
    """新着のみ分類 → 中間CSV出力。"""
    streams = load_stream_data(conn)
    existing = load_existing_tags(conn)
    published_map = load_published_at_map(conn)
    print(f'配信: {len(streams)}件, 既存タグ付き: {len(existing)}件')

    new_ids = set(streams.keys()) - set(existing.keys())
    print(f'新着（未分類）: {len(new_ids)}件')

    if not new_ids:
        print('\n新着の未分類配信はありません')
        return

    rows = []
    for vid in sorted(new_ids):
        s = streams[vid]
        tags = classify(s['title'], s['duration'], s['started_at'], tag_master, tag_keywords)
        tag_names = sorted([tag_master[t] for t in tags])
        rows.append({
            'video_id': vid,
            'video_title': s['title'],
            'published_at': published_map.get(vid, ''),
            'tags': ','.join(tag_names),
        })

    print(f'\n=== data-review/ に出力 ===')
    write_extracted_tags(rows)

    print(f'\n=== 新着 {len(rows)}件の自動分類 ===')
    for r in rows:
        tag_str = r['tags'] if r['tags'] else '(タグなし)'
        print(f'  {r["video_id"]} | {r["video_title"][:50]} → {tag_str}')

    print(f'\n→ data-review/extracted_tags.csv をレビューしてから just tags-import を実行してください')


def run_all(conn, tag_master, tag_keywords):
    """全件再分類 → 中間CSV出力。"""
    streams = load_stream_data(conn)
    published_map = load_published_at_map(conn)
    print(f'配信: {len(streams)}件')

    rows = []
    for vid in sorted(streams.keys()):
        s = streams[vid]
        tags = classify(s['title'], s['duration'], s['started_at'], tag_master, tag_keywords)
        tag_names = sorted([tag_master[t] for t in tags])
        rows.append({
            'video_id': vid,
            'video_title': s['title'],
            'published_at': published_map.get(vid, ''),
            'tags': ','.join(tag_names),
        })

    print(f'\n=== data-review/ に出力 ===')
    write_extracted_tags(rows)

    tagged = sum(1 for r in rows if r['tags'])
    print(f'  タグあり: {tagged}件, タグなし: {len(rows) - tagged}件')
    print(f'\n→ data-review/extracted_tags.csv をレビューしてから just tags-import を実行してください')


# ---------- 検証モード ----------

def run_verify(conn, tag_master, tag_keywords):
    """全件再分類 → 人手タグとの精度レポート。"""
    streams = load_stream_data(conn)
    existing = load_existing_tags(conn)

    target_ids = set(streams.keys()) & set(existing.keys())
    print(f'検証対象: {len(target_ids)}件（人手タグ付き配信）\n')

    stats = {tid: {'tp': 0, 'fp': 0, 'fn': 0, 'fp_list': [], 'fn_list': []}
             for tid in tag_master}

    for vid in sorted(target_ids):
        s = streams[vid]
        auto_tags = classify(s['title'], s['duration'], s['started_at'], tag_master, tag_keywords)
        human_tags = existing[vid]

        for tid in tag_master:
            in_auto = tid in auto_tags
            in_human = tid in human_tags

            if in_auto and in_human:
                stats[tid]['tp'] += 1
            elif in_auto and not in_human:
                stats[tid]['fp'] += 1
                stats[tid]['fp_list'].append((vid, s['title']))
            elif not in_auto and in_human:
                stats[tid]['fn'] += 1
                stats[tid]['fn_list'].append((vid, s['title']))

    print('=== 精度レポート ===')
    print(f'{"タグ":<12} {"precision":>10} {"recall":>10}    TP    FP    FN')
    print('-' * 70)

    for tid in sorted(tag_master.keys()):
        name = tag_master[tid]
        s = stats[tid]
        tp, fp, fn = s['tp'], s['fp'], s['fn']

        precision = tp / (tp + fp) * 100 if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) * 100 if (tp + fn) > 0 else 0

        print(f'  {name:<10} {precision:>9.1f}% {recall:>9.1f}%  {tp:>5} {fp:>5} {fn:>5}')

    for label, key in [('過検知 (FP)', 'fp_list'), ('見逃し (FN)', 'fn_list')]:
        items = []
        for tid in sorted(tag_master.keys()):
            name = tag_master[tid]
            for vid, title in stats[tid][key]:
                items.append((name, vid, title))

        if items:
            print(f'\n=== {label}: {len(items)}件 ===')
            for name, vid, title in items[:50]:
                print(f'  [{name}] {vid} | {title[:60]}')
            if len(items) > 50:
                print(f'  ... 他 {len(items) - 50}件')


# ---------- メイン ----------

def main():
    parser = argparse.ArgumentParser(description='配信タグ自動分類')
    parser.add_argument('--verify', action='store_true', help='全件再分類 → 精度レポート')
    parser.add_argument('--all', action='store_true', help='全件再分類 → 中間CSV出力')
    args = parser.parse_args()

    conn = get_readonly_connection()
    tag_master = load_tag_master(conn)
    tag_keywords = load_tag_keywords(conn)
    print(f'タグマスタ: {len(tag_master)}種, キーワード: {sum(len(v) for v in tag_keywords.values())}個\n')

    if args.verify:
        run_verify(conn, tag_master, tag_keywords)
    elif args.all:
        run_all(conn, tag_master, tag_keywords)
    else:
        run_normal(conn, tag_master, tag_keywords)

    conn.close()


if __name__ == '__main__':
    main()
