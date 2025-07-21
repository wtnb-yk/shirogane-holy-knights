#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
白銀ノエルさんのYouTubeチャンネルから動画情報を取得してCSVに出力するスクリプト

出力内容:
1. channels.csv - チャンネル情報
2. channel_details.csv - チャンネル詳細情報
3. archives.csv - アーカイブ基本情報
4. video_details.csv - 動画詳細情報
5. content_details.csv - コンテンツ詳細情報

使用方法:
1. YouTube Data API v3のAPIキーを取得
2. 以下のライブラリをインストール
   pip install google-api-python-client pandas
3. API_KEYを設定して実行
"""

import os
import csv
import time
import datetime
import pandas as pd
import uuid
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# APIキーを設定 (実行時に環境変数から取得するか、直接入力)
API_KEY = os.environ.get('YOUTUBE_API_KEY', '')  # 環境変数がない場合は直接入力: 'YOUR_API_KEY'

# 白銀ノエルさんのチャンネルID
CHANNEL_ID = 'UCdyqAaZDKHXg4Ahi7VENThQ'  # @ShiroganeNoel
CHANNEL_HANDLE = '@ShiroganeNoel'

def get_youtube_service():
    """YouTube Data API サービスを初期化"""
    return build('youtube', 'v3', developerKey=API_KEY)

def get_channel_info(youtube, channel_id):
    """チャンネル情報を取得"""
    print(f"チャンネル {channel_id} の情報を取得中...")
    
    channel_response = youtube.channels().list(
        part='snippet,statistics,brandingSettings',
        id=channel_id
    ).execute()
    
    if not channel_response['items']:
        print("チャンネル情報が取得できませんでした")
        return None, None
        
    channel = channel_response['items'][0]
    
    # チャンネル基本情報
    channel_info = {
        'id': channel['id'],
        'title': channel['snippet']['title']
    }
    
    # チャンネル詳細情報
    channel_details = {
        'channel_id': channel['id'],
        'handle': CHANNEL_HANDLE,
        'description': channel['snippet'].get('description', ''),
        'subscriber_count': channel['statistics'].get('subscriberCount', 0),
        'icon_url': channel['snippet'].get('thumbnails', {}).get('high', {}).get('url', '')
    }
    
    print(f"チャンネル情報を取得しました: {channel_info['title']}")
    return channel_info, channel_details

def get_all_video_ids(youtube, channel_id):
    """チャンネルのすべての動画IDを取得"""
    video_ids = []
    next_page_token = None

    print(f"チャンネル {channel_id} の動画ID一覧を取得中...")

    while True:
        # アップロード済み動画プレイリストIDを取得
        channel_response = youtube.channels().list(
            part='contentDetails',
            id=channel_id
        ).execute()

        # チャンネル情報から動画アップロードプレイリストIDを抽出
        if not channel_response['items']:
            print("チャンネル情報が取得できませんでした")
            return video_ids

        uploads_playlist_id = channel_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

        # プレイリスト内のすべての動画を取得
        request = youtube.playlistItems().list(
            part='snippet',
            playlistId=uploads_playlist_id,
            maxResults=50,
            pageToken=next_page_token
        )
        
        response = request.execute()
        
        # 動画IDを収集
        for item in response['items']:
            video_ids.append(item['snippet']['resourceId']['videoId'])
        
        # 次のページがあれば続行
        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break
            
    print(f"{len(video_ids)} 件の動画IDを取得しました")
    return video_ids

def get_videos_details(youtube, video_ids, channel_id):
    """動画IDリストから詳細情報を取得"""
    archives = []
    video_details = []
    content_details = []
    
    # YouTube APIは一度に50件までしか取得できないため、50件ずつ処理
    for i in range(0, len(video_ids), 50):
        batch_ids = video_ids[i:i+50]
        
        request = youtube.videos().list(
            part='snippet,contentDetails,statistics',
            id=','.join(batch_ids)
        )
        
        response = request.execute()
        
        # 各動画の詳細情報を取得
        for video in response['items']:
            video_id = video['id']
            
            # アーカイブ基本情報
            archive = {
                'id': video_id,
                'title': video['snippet']['title'],
                'published_at': video['snippet']['publishedAt'],
                'channel_id': channel_id
            }
            archives.append(archive)
            
            # 動画詳細情報
            video_detail = {
                'archive_id': video_id,
                'url': f"https://www.youtube.com/watch?v={video_id}",
                'duration': convert_duration_to_hhmmss(video['contentDetails'].get('duration', '')),
                'thumbnail_url': video['snippet']['thumbnails'].get('high', {}).get('url', '')
            }
            video_details.append(video_detail)
            
            # コンテンツ詳細情報
            is_members_only = 'memberOnly' in video['contentDetails'] and video['contentDetails']['memberOnly'] == True
            content_detail = {
                'archive_id': video_id,
                'description': video['snippet']['description'],
                'is_members_only': is_members_only
            }
            content_details.append(content_detail)
            
    print(f"{len(archives)} 件の動画情報を取得しました")
    return archives, video_details, content_details

def convert_duration_to_hhmmss(duration_str):
    """ISO 8601 形式の期間を HH:MM:SS 形式に変換"""
    import re
    import datetime
    
    # PT1H30M15S のような形式から時間、分、秒を抽出
    hours = re.search(r'(\d+)H', duration_str)
    minutes = re.search(r'(\d+)M', duration_str)
    seconds = re.search(r'(\d+)S', duration_str)
    
    h = int(hours.group(1)) if hours else 0
    m = int(minutes.group(1)) if minutes else 0
    s = int(seconds.group(1)) if seconds else 0
    
    # 時:分:秒 の形式で返す
    return f"{h:02d}:{m:02d}:{s:02d}"

def create_output_directory():
    """出力ディレクトリを作成"""
    # メインのresultディレクトリを作成
    base_dir = os.path.dirname(os.path.abspath(__file__))
    result_dir = os.path.join(base_dir, "result")
    
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)
    
    # 現在日時とUUIDを使用して固有のディレクトリ名を作成
    now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    output_dir = os.path.join(result_dir, f"{now}_{unique_id}")
    
    os.makedirs(output_dir)
    print(f"出力ディレクトリを作成しました: {output_dir}")
    
    return output_dir

def save_to_csv(data, output_file, output_dir):
    """データをCSVファイルに保存"""
    df = pd.DataFrame(data)
    
    # 出力ファイルパスを作成
    output_path = os.path.join(output_dir, output_file)
    
    # CSVに保存
    df.to_csv(output_path, index=False, encoding='utf-8')
    print(f"データを {output_path} に保存しました")
    return output_path

def main():
    """メイン処理"""
    if not API_KEY:
        print("エラー: YouTube API キーが設定されていません")
        print("環境変数 'YOUTUBE_API_KEY' を設定するか、スクリプト内の API_KEY 変数に直接設定してください")
        return

    try:
        # 出力ディレクトリを作成
        output_dir = create_output_directory()
        
        # YouTube Data API サービスを初期化
        youtube = get_youtube_service()
        
        # チャンネル情報を取得
        channel_info, channel_details = get_channel_info(youtube, CHANNEL_ID)
        if not channel_info:
            print("チャンネル情報の取得に失敗しました")
            return
        
        # すべての動画IDを取得
        video_ids = get_all_video_ids(youtube, CHANNEL_ID)
        if not video_ids:
            print("動画IDが取得できませんでした")
            return
            
        # 各動画の詳細情報を取得
        archives, video_details, content_details = get_videos_details(youtube, video_ids, CHANNEL_ID)
        
        # CSVファイルに保存
        save_to_csv([channel_info], 'channels.csv', output_dir)
        save_to_csv([channel_details], 'channel_details.csv', output_dir)
        save_to_csv(archives, 'archives.csv', output_dir)
        save_to_csv(video_details, 'video_details.csv', output_dir)
        save_to_csv(content_details, 'content_details.csv', output_dir)
        
        # 出力ディレクトリと結果のサマリを表示
        print(f"\n=== 処理完了 ===")
        print(f"出力ディレクトリ: {output_dir}")
        print(f"取得したチャンネル: {channel_info['title']}")
        print(f"取得した動画数: {len(archives)} 件")
        
    except HttpError as e:
        print(f"HTTPエラーが発生しました: {e.resp.status} {e.content}")
    except Exception as e:
        print(f"エラーが発生しました: {str(e)}")

if __name__ == "__main__":
    main()