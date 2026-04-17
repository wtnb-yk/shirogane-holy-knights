#!/usr/bin/env python3
"""
YouTube コメントから楽曲セットリストを抽出し、正規化CSVを出力する。

出力（data-staging/）:
  - songs.csv              曲マスタ（既存 + 新曲）
  - stream_songs.csv       歌枠 junction
  - concert_songs.csv      ライブ junction
  - extracted_songs_*.csv   フラット確認用

使い方:
  python3 extract_songs.py                # 歌枠+ライブ両方
  python3 extract_songs.py --type stream  # 歌枠のみ
  python3 extract_songs.py --type live    # ライブのみ
"""

import argparse
import sys

from extract_songs_common import (
    get_youtube_service,
    get_tagged_video_ids,
    extract_from_videos,
    load_songs_master,
    normalize_and_save,
    write_csv,
)


TARGETS = {
    'stream': [('歌枠', 'stream_songs.csv', 'extracted_songs_stream.csv')],
    'live': [('ライブ', 'concert_songs.csv', 'extracted_songs_live.csv')],
    'all': [
        ('歌枠', 'stream_songs.csv', 'extracted_songs_stream.csv'),
        ('ライブ', 'concert_songs.csv', 'extracted_songs_live.csv'),
    ],
}


def main():
    parser = argparse.ArgumentParser(description='YouTube コメントから楽曲抽出')
    parser.add_argument('--type', choices=['stream', 'live', 'all'], default='all')
    args = parser.parse_args()

    try:
        youtube = get_youtube_service()
    except ValueError as e:
        print(f'エラー: {e}')
        sys.exit(1)

    # 曲マスタを読み込み（全タイプで共有）
    songs_master, songs_index = load_songs_master()
    print(f'既存曲マスタ: {len(songs_master)}件\n')

    for tag_name, junction_file, flat_file in TARGETS[args.type]:
        print(f'=== {tag_name} ===')
        videos = get_tagged_video_ids(tag_name)
        print(f'{len(videos)}件の動画\n')

        if not videos:
            print('  動画が見つかりませんでした')
            continue

        # 抽出
        extracted = extract_from_videos(youtube, videos)

        # 正規化して出力
        print(f'\n=== data-staging/ に出力 ===')
        normalize_and_save(extracted, junction_file, flat_file, songs_master, songs_index)

    # 曲マスタを出力（全タイプの新曲が反映済み）
    write_csv('songs.csv', ['id', 'title', 'artist'], songs_master)

    print('\n完了')


if __name__ == '__main__':
    main()
