"""イベント計測データの集計 CLI

Usage:
    python event_stats.py summary        # イベント種別ごとの合計
    python event_stats.py daily          # 日別アクション推移
    python event_stats.py top-streams    # チェック数 Top 20 配信
    python event_stats.py top-songs      # お気に入り数 Top 20 楽曲
    python event_stats.py shares         # シェア・DL 回数（ページ別）
"""

import os
import sys
from collections import Counter, defaultdict
from datetime import datetime

import boto3

TABLE_NAME = "danin-log-events"
REGION = "ap-northeast-1"
ENDPOINT_URL = os.environ.get("AWS_ENDPOINT_URL")


def scan_all(table):
    """DynamoDB テーブルの全件を取得"""
    items = []
    response = table.scan()
    items.extend(response["Items"])
    while "LastEvaluatedKey" in response:
        response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
        items.extend(response["Items"])
    return items


def cmd_summary(items):
    counter = Counter()
    for item in items:
        key = (item["pk"], item["action"])
        counter[key] += 1

    print(f"{'TYPE':<16} {'ACTION':<10} {'COUNT':>6}")
    print(f"{'----':<16} {'------':<10} {'-----':>6}")
    for (typ, action), count in sorted(counter.items()):
        print(f"{typ:<16} {action:<10} {count:>6}")
    print(f"\n合計: {len(items)} 件")


def cmd_top(items, event_type, id_label):
    filtered = [i for i in items if i["pk"] == event_type and i.get("target_id")]
    adds = Counter()
    removes = Counter()
    for item in filtered:
        tid = item["target_id"]
        if item["action"] == "add":
            adds[tid] += 1
        elif item["action"] == "remove":
            removes[tid] += 1

    print(f"{id_label:<16} {'ADD':>6} {'REMOVE':>8} {'NET':>6}")
    print(f"{'-' * 16} {'---':>6} {'------':>8} {'---':>6}")
    for tid, add_count in adds.most_common(20):
        rm = removes.get(tid, 0)
        print(f"{tid:<16} {add_count:>6} {rm:>8} {add_count - rm:>6}")


def cmd_daily(items):
    # 日付ごと × イベント種別でカウント
    daily = defaultdict(Counter)
    for item in items:
        date = item.get("created_at", item["sk"])[:10]  # YYYY-MM-DD
        event_key = f"{item['pk']}:{item['action']}"
        daily[date][event_key] += 1

    if not daily:
        print("イベントがありません")
        return

    # 全イベント種別を収集（列ヘッダー用）
    all_keys = sorted({k for counts in daily.values() for k in counts})

    # 短縮ラベル（ヘッダーが長すぎないように）
    short = {
        "stream_check:add": "✓stream",
        "stream_check:remove": "✗stream",
        "song_favorite:add": "✓song",
        "song_favorite:remove": "✗song",
        "share:add": "share",
        "download:add": "download",
    }

    labels = [short.get(k, k) for k in all_keys]
    col_w = max(8, *(len(l) for l in labels))

    # ヘッダー
    header = f"{'DATE':<12}" + "".join(f"{l:>{col_w}}" for l in labels) + f"{'TOTAL':>7}"
    print(header)
    print("─" * len(header))

    # 日付降順で表示
    grand_total = 0
    for date in sorted(daily.keys(), reverse=True):
        counts = daily[date]
        row_total = sum(counts.values())
        grand_total += row_total

        # 曜日
        try:
            dow = ["月", "火", "水", "木", "金", "土", "日"][
                datetime.strptime(date, "%Y-%m-%d").weekday()
            ]
        except ValueError:
            dow = " "
        day_label = f"{date}({dow})"

        cols = "".join(
            f"{counts.get(k, 0) or '·':>{col_w}}" for k in all_keys
        )

        # ミニバーチャート
        bar = "▎" * min(row_total, 50)
        print(f"{day_label:<12}{cols}{row_total:>7}  {bar}")

    print("─" * len(header))
    print(f"{'合計':<12}" + "".join(
        f"{sum(daily[d].get(k, 0) for d in daily):>{col_w}}" for k in all_keys
    ) + f"{grand_total:>7}")
    print(f"\n{len(daily)} 日間 / {grand_total} イベント")


def cmd_shares(items):
    counter = Counter()
    for item in items:
        if item["pk"] in ("share", "download"):
            key = (item["pk"], item.get("page", ""))
            counter[key] += 1

    print(f"{'TYPE':<12} {'PAGE':<12} {'COUNT':>6}")
    print(f"{'----':<12} {'----':<12} {'-----':>6}")
    for (typ, page), count in sorted(counter.items(), key=lambda x: -x[1]):
        print(f"{typ:<12} {page:<12} {count:>6}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    kwargs = {"region_name": REGION}
    if ENDPOINT_URL:
        kwargs["endpoint_url"] = ENDPOINT_URL
    dynamodb = boto3.resource("dynamodb", **kwargs)
    table = dynamodb.Table(TABLE_NAME)
    items = scan_all(table)

    cmd = sys.argv[1]
    if cmd == "summary":
        cmd_summary(items)
    elif cmd == "daily":
        cmd_daily(items)
    elif cmd == "top-streams":
        cmd_top(items, "stream_check", "VIDEO_ID")
    elif cmd == "top-songs":
        cmd_top(items, "song_favorite", "SONG_ID")
    elif cmd == "shares":
        cmd_shares(items)
    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
