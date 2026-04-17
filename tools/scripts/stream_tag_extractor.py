#!/usr/bin/env python3
"""
配信タイトルからタグを自動判定し、video_stream_tags.csv を更新する。

既存データ: tools/data/
出力先:     tools/data-staging/video_stream_tags.csv

キーワードルール: tools/data/tag_keywords.csv（CSV駆動）
特殊ルール:       コード内（雑談/ゲーム/企画/記念/ライブの5タグ）

モード:
  通常:   新着（未分類）のみ分類 → staging 出力
  --verify: 全件再分類 → 人手タグとの精度レポート
"""

import argparse
import csv
import re
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set

ROOT = Path(__file__).resolve().parent.parent  # tools/
DATA_DIR = ROOT / 'data'
STAGING_DIR = ROOT / 'data-staging'


# ---------- CSV 読み込み ----------

def read_csv_list(filename):
    path = DATA_DIR / filename
    if not path.exists():
        return []
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def read_csv_keyed(filename, key_field):
    path = DATA_DIR / filename
    result = {}
    if path.exists():
        with open(path, newline='', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                result[row[key_field]] = row
    return result


def write_csv(filename, fieldnames, rows):
    STAGING_DIR.mkdir(parents=True, exist_ok=True)
    path = STAGING_DIR / filename
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, '') for k in fieldnames})
    print(f'  {filename}: {len(rows)}件')


# ---------- データ読み込み ----------

def load_tag_master() -> Dict[int, str]:
    """stream_tags.csv → {tag_id: tag_name}"""
    rows = read_csv_list('stream_tags.csv')
    return {int(r['id']): r['name'] for r in rows}


def load_tag_keywords() -> Dict[int, List[str]]:
    """tag_keywords.csv → {tag_id: [keyword, ...]}"""
    rows = read_csv_list('tag_keywords.csv')
    result = defaultdict(list)
    for r in rows:
        result[int(r['tag_id'])].append(r['keyword'])
    return dict(result)


def load_stream_data():
    """配信データを読み込み → {video_id: {title, duration, started_at}}"""
    vv_types = read_csv_list('video_video_types.csv')
    stream_ids = {r['video_id'] for r in vv_types if r['video_type_id'] == '1'}

    videos = read_csv_keyed('videos.csv', 'id')
    details = read_csv_keyed('stream_details.csv', 'video_id')

    streams = {}
    for vid in stream_ids:
        v = videos.get(vid)
        if not v:
            continue
        sd = details.get(vid)
        streams[vid] = {
            'title': v['title'],
            'duration': v.get('duration'),
            'started_at': sd['started_at'] if sd else None,
        }
    return streams


def load_existing_tags() -> Dict[str, Set[int]]:
    """video_stream_tags.csv → {video_id: {tag_id, ...}}"""
    rows = read_csv_list('video_stream_tags.csv')
    result = defaultdict(set)
    for r in rows:
        result[r['video_id']].add(int(r['tag_id']))
    return dict(result)


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

    # --- Phase 1: キーワードマッチ（CSV駆動） ---
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


# ---------- 通常モード ----------

def run_normal(tag_master, tag_keywords):
    """新着のみ分類 → staging 出力。"""
    streams = load_stream_data()
    existing = load_existing_tags()
    print(f'配信: {len(streams)}件, 既存タグ付き: {len(existing)}件')

    new_ids = set(streams.keys()) - set(existing.keys())
    print(f'新着（未分類）: {len(new_ids)}件')

    # 新着を分類
    new_rows = []
    new_report = []
    for vid in sorted(new_ids):
        s = streams[vid]
        tags = classify(s['title'], s['duration'], s['started_at'], tag_master, tag_keywords)
        for tid in sorted(tags):
            new_rows.append({'video_id': vid, 'tag_id': str(tid)})
        tag_names = [tag_master[t] for t in sorted(tags)]
        new_report.append((vid, s['title'], tag_names))

    # 既存 + 新着をマージ
    existing_rows = read_csv_list('video_stream_tags.csv')
    merged = list(existing_rows) + new_rows

    print(f'\n=== data-staging/ に出力 ===')
    write_csv('video_stream_tags.csv', ['video_id', 'tag_id'], merged)

    if new_report:
        print(f'\n=== 新着 {len(new_report)}件の自動分類 ===')
        for vid, title, tags in new_report:
            tag_str = ', '.join(tags) if tags else '(タグなし)'
            print(f'  {vid} | {title[:50]} → {tag_str}')
    else:
        print('\n新着の未分類配信はありません')


# ---------- 検証モード ----------

def run_verify(tag_master, tag_keywords):
    """全件再分類 → 人手タグとの精度レポート。"""
    streams = load_stream_data()
    existing = load_existing_tags()

    # 人手タグ付き配信のみ対象
    target_ids = set(streams.keys()) & set(existing.keys())
    print(f'検証対象: {len(target_ids)}件（人手タグ付き配信）\n')

    # タグごとの TP/FP/FN を集計
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

    # レポート出力
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

    # 差分詳細
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
    args = parser.parse_args()

    tag_master = load_tag_master()
    tag_keywords = load_tag_keywords()
    print(f'タグマスタ: {len(tag_master)}種, キーワード: {sum(len(v) for v in tag_keywords.values())}個\n')

    if args.verify:
        run_verify(tag_master, tag_keywords)
    else:
        run_normal(tag_master, tag_keywords)


if __name__ == '__main__':
    main()
