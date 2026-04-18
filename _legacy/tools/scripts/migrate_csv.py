"""
DBダンプから新CSV構造へのマイグレーションスクリプト。

ソース: tools/output/db_dump/prd/20260413_152320/
出力先: tools/data/

設計書: docs/07-csv-design.md
"""

import csv
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
DUMP_DIR = ROOT / 'tools' / 'output' / 'db_dump' / 'prd' / '20260413_152320'
DATA_DIR = ROOT / 'tools' / 'data'


def read_dump(filename: str) -> tuple[list[str], list[dict]]:
    """DBダンプCSVを読み込み、(ヘッダー, 行リスト) を返す。"""
    with open(DUMP_DIR / filename, 'r', newline='') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        return reader.fieldnames or [], rows


def write_csv(filename: str, fieldnames: list[str], rows: list[dict]):
    """新CSVを出力する。"""
    with open(DATA_DIR / filename, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row[k] for k in fieldnames})


def migrate_channels():
    """channels: description, created_at 削除"""
    _, rows = read_dump('channels.csv')
    fields = ['id', 'title', 'handle', 'icon_url']
    write_csv('channels.csv', fields, rows)
    print(f'channels.csv: {len(rows)}件')


def migrate_videos():
    """videos: description, url, created_at 削除"""
    _, rows = read_dump('videos.csv')
    fields = ['id', 'title', 'thumbnail_url', 'duration', 'channel_id', 'published_at']
    write_csv('videos.csv', fields, rows)
    print(f'videos.csv: {len(rows)}件')


def migrate_video_types():
    """video_types: そのまま"""
    _, rows = read_dump('video_types.csv')
    fields = ['id', 'type']
    write_csv('video_types.csv', fields, rows)
    print(f'video_types.csv: {len(rows)}件')


def migrate_video_video_types():
    """video_video_types: created_at 削除"""
    _, rows = read_dump('video_video_types.csv')
    fields = ['video_id', 'video_type_id']
    write_csv('video_video_types.csv', fields, rows)
    print(f'video_video_types.csv: {len(rows)}件')


def migrate_stream_details():
    """stream_details: created_at 削除"""
    _, rows = read_dump('stream_details.csv')
    fields = ['video_id', 'started_at']
    write_csv('stream_details.csv', fields, rows)
    print(f'stream_details.csv: {len(rows)}件')


def migrate_hidden_streams():
    """hidden_streams: そのまま"""
    _, rows = read_dump('hidden_streams.csv')
    fields = ['video_id']
    write_csv('hidden_streams.csv', fields, rows)
    print(f'hidden_streams.csv: {len(rows)}件')


def migrate_stream_tags():
    """stream_tags: description, created_at 削除"""
    _, rows = read_dump('stream_tags.csv')
    fields = ['id', 'name']
    write_csv('stream_tags.csv', fields, rows)
    print(f'stream_tags.csv: {len(rows)}件')


def migrate_video_stream_tags():
    """video_stream_tags: created_at 削除"""
    _, rows = read_dump('video_stream_tags.csv')
    fields = ['video_id', 'tag_id']
    write_csv('video_stream_tags.csv', fields, rows)
    print(f'video_stream_tags.csv: {len(rows)}件')


def migrate_songs():
    """songs: created_at 削除"""
    _, rows = read_dump('songs.csv')
    fields = ['id', 'title', 'artist']
    write_csv('songs.csv', fields, rows)
    print(f'songs.csv: {len(rows)}件')


def migrate_stream_songs():
    """stream_songs: created_at 削除"""
    _, rows = read_dump('stream_songs.csv')
    fields = ['song_id', 'video_id', 'start_seconds']
    write_csv('stream_songs.csv', fields, rows)
    print(f'stream_songs.csv: {len(rows)}件')


def migrate_concert_songs():
    """concert_songs: created_at 削除"""
    _, rows = read_dump('concert_songs.csv')
    fields = ['song_id', 'video_id', 'start_seconds']
    write_csv('concert_songs.csv', fields, rows)
    print(f'concert_songs.csv: {len(rows)}件')


def migrate_music_video_types():
    """music_video_types: created_at 削除"""
    _, rows = read_dump('music_video_types.csv')
    fields = ['id', 'type_name']
    write_csv('music_video_types.csv', fields, rows)
    print(f'music_video_types.csv: {len(rows)}件')


def migrate_music_videos():
    """music_videos: created_at 削除"""
    _, rows = read_dump('music_videos.csv')
    fields = ['song_id', 'video_id', 'music_video_type_id']
    write_csv('music_videos.csv', fields, rows)
    print(f'music_videos.csv: {len(rows)}件')


def migrate_album_types():
    """album_types: description, created_at 削除"""
    _, rows = read_dump('album_types.csv')
    fields = ['id', 'type_name']
    write_csv('album_types.csv', fields, rows)
    print(f'album_types.csv: {len(rows)}件')


def migrate_albums():
    """albums: created_at 削除"""
    _, rows = read_dump('albums.csv')
    fields = ['id', 'title', 'artist', 'album_type_id', 'release_date', 'cover_image_url']
    write_csv('albums.csv', fields, rows)
    print(f'albums.csv: {len(rows)}件')


def migrate_album_tracks():
    """album_tracks: created_at 削除"""
    _, rows = read_dump('album_tracks.csv')
    fields = ['id', 'album_id', 'song_id', 'track_number']
    write_csv('album_tracks.csv', fields, rows)
    print(f'album_tracks.csv: {len(rows)}件')


def migrate_news():
    """news: created_at 削除"""
    _, rows = read_dump('news.csv')
    fields = ['id', 'title', 'content', 'thumbnail_url', 'external_url', 'published_at']
    write_csv('news.csv', fields, rows)
    print(f'news.csv: {len(rows)}件')


def migrate_news_categories():
    """news_categories: created_at 削除"""
    _, rows = read_dump('news_categories.csv')
    fields = ['id', 'name', 'sort_order']
    write_csv('news_categories.csv', fields, rows)
    print(f'news_categories.csv: {len(rows)}件')


def migrate_news_news_categories():
    """news_news_categories: created_at 削除"""
    _, rows = read_dump('news_news_categories.csv')
    fields = ['news_id', 'news_category_id']
    write_csv('news_news_categories.csv', fields, rows)
    print(f'news_news_categories.csv: {len(rows)}件')


def migrate_events():
    """events: created_at 削除"""
    _, rows = read_dump('events.csv')
    fields = ['id', 'title', 'description', 'event_date', 'event_time', 'end_date', 'end_time', 'url', 'image_url']
    write_csv('events.csv', fields, rows)
    print(f'events.csv: {len(rows)}件')


def migrate_event_types():
    """event_types: そのまま"""
    _, rows = read_dump('event_types.csv')
    fields = ['id', 'type']
    write_csv('event_types.csv', fields, rows)
    print(f'event_types.csv: {len(rows)}件')


def migrate_event_event_types():
    """event_event_types: created_at 削除"""
    _, rows = read_dump('event_event_types.csv')
    fields = ['event_id', 'event_type_id']
    write_csv('event_event_types.csv', fields, rows)
    print(f'event_event_types.csv: {len(rows)}件')


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    print('=== 動画基盤 ===')
    migrate_channels()
    migrate_videos()
    migrate_video_types()
    migrate_video_video_types()
    migrate_stream_details()
    migrate_hidden_streams()

    print('\n=== タグ ===')
    migrate_stream_tags()
    migrate_video_stream_tags()

    print('\n=== 楽曲 ===')
    migrate_songs()
    migrate_stream_songs()
    migrate_concert_songs()

    print('\n=== MV ===')
    migrate_music_video_types()
    migrate_music_videos()

    print('\n=== アルバム ===')
    migrate_album_types()
    migrate_albums()
    migrate_album_tracks()

    print('\n=== ニュース・イベント ===')
    migrate_news()
    migrate_news_categories()
    migrate_news_news_categories()
    migrate_events()
    migrate_event_types()
    migrate_event_event_types()

    print(f'\n=== 完了: {len(list(DATA_DIR.glob("*.csv")))}ファイル生成 ===')


if __name__ == '__main__':
    main()