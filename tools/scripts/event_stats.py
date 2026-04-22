"""イベント計測データの集計 CLI

Usage:
    python event_stats.py summary        # イベント種別ごとの合計
    python event_stats.py top-streams    # チェック数 Top 20 配信
    python event_stats.py top-songs      # お気に入り数 Top 20 楽曲
    python event_stats.py shares         # シェア・DL 回数（ページ別）
"""

import sys
from collections import Counter

import boto3

TABLE_NAME = "danin-log-events"
REGION = "ap-northeast-1"


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

    dynamodb = boto3.resource("dynamodb", region_name=REGION)
    table = dynamodb.Table(TABLE_NAME)
    items = scan_all(table)

    cmd = sys.argv[1]
    if cmd == "summary":
        cmd_summary(items)
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
