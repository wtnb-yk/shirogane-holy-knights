#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
白銀ノエルさんのYouTubeチャンネルからメンバー限定動画情報を取得するスクリプト
Seleniumを使用してブラウザを自動化し、ログイン後にメンバーシップコンテンツを取得します

使用方法:
1. 必要なライブラリをインストール
   pip install selenium pandas webdriver-manager

2. ログイン情報を環境変数または直接スクリプトに設定
3. スクリプトを実行
"""

import os
import time
import json
import pandas as pd
from datetime import datetime
import uuid
import re
import logging

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager

# ログ設定
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 設定
YOUTUBE_EMAIL = os.environ.get('YOUTUBE_EMAIL', '')  # Googleアカウントのメールアドレス
YOUTUBE_PASSWORD = os.environ.get('YOUTUBE_PASSWORD', '')  # パスワード
CHANNEL_ID = 'UCdyqAaZDKHXg4Ahi7VENThQ'  # 白銀ノエル @ShiroganeNoel
CHANNEL_HANDLE = '@ShiroganeNoel'
WAIT_TIMEOUT = 30  # 要素待機のタイムアウト（秒）
SCROLL_PAUSE_TIME = 2  # スクロール間隔（秒）

def setup_driver():
    """Chromeドライバーの設定と初期化"""
    logger.info("ブラウザを初期化中...")
    
    options = Options()
    options.add_argument("--start-maximized")  # ブラウザを最大化
    options.add_argument("--disable-infobars")  # 情報バーを無効化
    options.add_argument("--disable-extensions")  # 拡張機能を無効化
    options.add_argument("--disable-notifications")  # 通知を無効化
    options.add_argument("--disable-gpu")  # GPUハードウェアアクセラレーションを無効化
    options.add_argument("--disable-dev-shm-usage")  # /dev/shmの使用を無効化
    options.add_argument("--no-sandbox")  # サンドボックスを無効化
    
    # ヘッドレスモードを使用する場合はコメント解除（動作確認が必要）
    # options.add_argument("--headless")
    
    # ユーザーエージェントを設定
    options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36")
    
    # ドライバーを初期化
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    # ページロードのタイムアウトを設定
    driver.set_page_load_timeout(60)
    
    return driver

def login_to_youtube(driver):
    """YouTubeにログイン"""
    if not YOUTUBE_EMAIL or not YOUTUBE_PASSWORD:
        logger.error("YouTube認証情報が設定されていません。環境変数または直接スクリプト内で設定してください。")
        return False
        
    try:
        logger.info("YouTubeにログイン中...")
        
        # YouTubeにアクセス
        driver.get("https://www.youtube.com")
        
        # サインインボタンをクリック
        wait = WebDriverWait(driver, WAIT_TIMEOUT)
        sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//ytd-button-renderer[contains(@class, 'style-suggestive')]//a")))
        sign_in_button.click()
        
        # Googleログインページ
        # Eメールを入力
        email_input = wait.until(EC.presence_of_element_located((By.ID, "identifierId")))
        email_input.send_keys(YOUTUBE_EMAIL)
        
        # 次へボタン
        next_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'VfPpkd-LgbsSe')]")))
        next_button.click()
        
        # パスワード入力フィールドが表示されるまで待機
        password_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
        password_input.send_keys(YOUTUBE_PASSWORD)
        
        # 次へボタン
        next_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'VfPpkd-LgbsSe')]")))
        next_button.click()
        
        # ログイン成功の確認（YouTubeトップページに戻る）
        wait.until(EC.presence_of_element_located((By.ID, "avatar-btn")))
        logger.info("ログインに成功しました")
        
        return True
        
    except Exception as e:
        logger.error(f"ログイン中にエラーが発生しました: {str(e)}")
        return False

def get_channel_url():
    """チャンネルのメンバーシップページURLを生成"""
    # チャンネルURLのパターン
    base_url = f"https://www.youtube.com/{CHANNEL_HANDLE}/membership"
    return base_url

def extract_video_info(driver, video_element):
    """動画要素から情報を抽出"""
    try:
        # 動画ID
        video_url = video_element.find_element(By.CSS_SELECTOR, "a#thumbnail").get_attribute("href")
        video_id = re.search(r"v=([^&]+)", video_url).group(1)
        
        # タイトル
        title_element = video_element.find_element(By.CSS_SELECTOR, "h3 a#video-title")
        title = title_element.get_attribute("title")
        
        # サムネイル
        thumbnail_url = video_element.find_element(By.CSS_SELECTOR, "img").get_attribute("src")
        if "i.ytimg.com" in thumbnail_url:
            # より高解像度のサムネイルURLを生成
            thumbnail_url = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
        
        # 公開日時
        try:
            publish_info = video_element.find_element(By.CSS_SELECTOR, "div#metadata-line span:nth-child(2)").text
            # "1 年前" のような形式から日時を推測
            # 注：正確な日時は個別の動画ページから取得する必要があります
            published_at = datetime.now().isoformat()  # 仮の値
        except:
            published_at = datetime.now().isoformat()
        
        # 動画時間
        try:
            duration_text = video_element.find_element(By.CSS_SELECTOR, "span#text.ytd-thumbnail-overlay-time-status-renderer").text
            # "12:34" 形式を "00:12:34" 形式に変換
            if len(duration_text.split(":")) == 2:
                duration = f"00:{duration_text}"
            else:
                duration = duration_text
        except:
            duration = "00:00:00"
        
        return {
            "id": video_id,
            "title": title,
            "url": video_url,
            "published_at": published_at,
            "thumbnail_url": thumbnail_url,
            "duration": duration,
            "is_members_only": True,
            "channel_id": CHANNEL_ID
        }
    except Exception as e:
        logger.error(f"動画情報の抽出中にエラーが発生しました: {str(e)}")
        return None

def get_members_only_videos(driver):
    """メンバーシップページから動画を取得"""
    videos = []
    
    try:
        # メンバーシップページに移動
        members_url = get_channel_url()
        logger.info(f"メンバーシップページにアクセス中: {members_url}")
        driver.get(members_url)
        
        # ページが読み込まれるまで待機
        wait = WebDriverWait(driver, WAIT_TIMEOUT)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "ytd-browse")))
        
        # メンバーシップコンテンツが表示されるまで少し待機
        time.sleep(5)
        
        # 動画セクションにスクロール
        logger.info("メンバー限定動画を検索中...")
        
        # ページを下にスクロールして動画をロード
        last_height = driver.execute_script("return document.documentElement.scrollHeight")
        
        while True:
            # 下にスクロール
            driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
            
            # 読み込み待機
            time.sleep(SCROLL_PAUSE_TIME)
            
            # 新しい高さを取得
            new_height = driver.execute_script("return document.documentElement.scrollHeight")
            
            # もしスクロールが止まったら終了
            if new_height == last_height:
                # もう一度試してみる
                time.sleep(SCROLL_PAUSE_TIME * 2)
                new_height = driver.execute_script("return document.documentElement.scrollHeight")
                if new_height == last_height:
                    break
            
            last_height = new_height
            
            # 現在の動画数を表示
            current_videos = driver.find_elements(By.CSS_SELECTOR, "ytd-grid-video-renderer")
            logger.info(f"現在 {len(current_videos)} 件のメンバー限定動画をロード中...")
        
        # すべての動画要素を取得
        video_elements = driver.find_elements(By.CSS_SELECTOR, "ytd-grid-video-renderer")
        logger.info(f"{len(video_elements)} 件のメンバー限定動画が見つかりました")
        
        # 各動画の情報を抽出
        for video_element in video_elements:
            video_info = extract_video_info(driver, video_element)
            if video_info:
                videos.append(video_info)
                
        logger.info(f"{len(videos)} 件のメンバー限定動画情報を取得しました")
        
        return videos
        
    except Exception as e:
        logger.error(f"メンバー限定動画の取得中にエラーが発生しました: {str(e)}")
        return videos

def create_output_directory():
    """出力ディレクトリを作成"""
    # メインのresultディレクトリを作成
    base_dir = os.path.dirname(os.path.abspath(__file__))
    result_dir = os.path.join(base_dir, "result")
    
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)
    
    # 現在日時とUUIDを使用して固有のディレクトリ名を作成
    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    output_dir = os.path.join(result_dir, f"members_only_{now}_{unique_id}")
    
    os.makedirs(output_dir)
    logger.info(f"出力ディレクトリを作成しました: {output_dir}")
    
    return output_dir

def save_to_csv(data, output_file, output_dir):
    """データをCSVファイルに保存"""
    if not data:
        logger.warning(f"保存するデータがありません: {output_file}")
        return None
        
    df = pd.DataFrame(data)
    
    # 出力ファイルパスを作成
    output_path = os.path.join(output_dir, output_file)
    
    # CSVに保存
    df.to_csv(output_path, index=False, encoding='utf-8')
    logger.info(f"データを {output_path} に保存しました")
    return output_path

def prepare_db_format_data(videos):
    """DB形式のデータを準備"""
    archives = []
    video_details = []
    content_details = []
    
    for video in videos:
        # アーカイブ情報
        archive = {
            'id': video['id'],
            'title': video['title'],
            'published_at': video['published_at'],
            'channel_id': video['channel_id']
        }
        archives.append(archive)
        
        # 動画詳細情報
        video_detail = {
            'archive_id': video['id'],
            'url': video['url'],
            'duration': video['duration'],
            'thumbnail_url': video['thumbnail_url']
        }
        video_details.append(video_detail)
        
        # コンテンツ詳細情報
        content_detail = {
            'archive_id': video['id'],
            'description': '',  # 個別ページからの取得が必要
            'is_members_only': True
        }
        content_details.append(content_detail)
    
    return archives, video_details, content_details

def main():
    """メイン処理"""
    logger.info("メンバー限定動画取得プロセスを開始します")
    
    driver = None
    try:
        # 出力ディレクトリを作成
        output_dir = create_output_directory()
        
        # ドライバーを初期化
        driver = setup_driver()
        
        # YouTubeにログイン
        if not login_to_youtube(driver):
            logger.error("YouTubeへのログインに失敗しました。処理を終了します。")
            return
        
        # メンバー限定動画を取得
        members_videos = get_members_only_videos(driver)
        
        if not members_videos:
            logger.warning("メンバー限定動画が取得できませんでした")
            return
            
        # 元のデータを保存（参照用）
        save_to_csv(members_videos, "members_videos_raw.csv", output_dir)
        
        # DB形式のデータを準備
        archives, video_details, content_details = prepare_db_format_data(members_videos)
        
        # DB形式でCSV保存
        save_to_csv(archives, "members_archives.csv", output_dir)
        save_to_csv(video_details, "members_video_details.csv", output_dir)
        save_to_csv(content_details, "members_content_details.csv", output_dir)
        
        logger.info(f"処理完了: 合計 {len(archives)} 件のメンバー限定動画情報をCSV形式で保存しました")
        logger.info(f"出力ディレクトリ: {output_dir}")
        
    except Exception as e:
        logger.error(f"処理中にエラーが発生しました: {str(e)}")
    finally:
        # ドライバーをクリーンアップ
        if driver:
            driver.quit()
            logger.info("ブラウザを終了しました")

if __name__ == "__main__":
    main()