#!/usr/bin/env python3
"""
歌枠からの曲抽出スクリプト
YouTubeのコメントからタイムスタンプとセットリストを抽出
"""
import sys
from pathlib import Path
from extract_songs_common import (
    get_youtube_service,
    get_stream_videos_from_db,
    process_videos_and_save_to_csv
)

def main():
    print("=== 歌枠の曲抽出を開始 ===")
    print("YouTube Data APIキーを確認中...")
    
    # YouTube APIサービスの初期化
    try:
        youtube = get_youtube_service()
        print("YouTube API接続成功")
    except ValueError as e:
        print(f"エラー: {e}")
        print("環境変数YOUTUBE_API_KEYを設定してください:")
        print("export YOUTUBE_API_KEY='your-api-key-here'")
        sys.exit(1)
    
    # 歌枠のみを処理
    tag_name = '歌枠'
    print(f"\nDBから{tag_name}動画リストを取得中...")
    videos = get_stream_videos_from_db(tag_name)
    print(f"{len(videos)}件の{tag_name}動画を取得しました")
    
    if not videos:
        print(f"{tag_name}の動画が見つかりませんでした")
        sys.exit(0)
    
    # CSVファイル名を決定
    output_dir = Path(__file__).parent.parent / 'output' / 'songs'
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_filename = str(output_dir / 'extracted_songs_stream.csv')
    
    # 動画を処理してCSVに保存
    process_videos_and_save_to_csv(youtube, videos, csv_filename, tag_name)
    
    print("\n=== 歌枠の曲抽出が完了しました！ ===")
    print(f"結果: {csv_filename}")

if __name__ == "__main__":
    main()