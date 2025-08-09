#!/usr/bin/env python3
import psycopg2
import csv
import re
from typing import List, Dict, Tuple

def connect_db():
    """ローカルPostgreSQLデータベースに接続"""
    return psycopg2.connect(
        host='localhost',
        port=5432,
        database='shirogane',
        user='postgres',
        password='postgres'
    )

def get_stream_tags(conn) -> Dict[int, str]:
    """stream_tagsテーブルからタグ情報を取得"""
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM stream_tags")
    return {tag_id: name for tag_id, name in cursor.fetchall()}

def get_stream_data(conn) -> List[Tuple[str, str]]:
    """配信データ（video_id, title）を取得"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT v.id, v.title 
        FROM videos v 
        JOIN stream_details sd ON v.id = sd.video_id
    """)
    return cursor.fetchall()

def extract_tags_from_title(title: str, available_tags: Dict[int, str]) -> List[int]:
    """タイトルからタグを導出"""
    matched_tags = []
    
    # タイトルを小文字に変換して検索
    title_lower = title.lower()
    
    # 各タグがタイトルに含まれるかチェック
    for tag_id, tag_name in available_tags.items():
        # 基本的なキーワードマッチング
        if tag_name in title:
            matched_tags.append(tag_id)
            continue
            
        # より詳細なルールベースマッチング
        if tag_name == "雑談":
            keywords = ["雑談", "朝活", "おは", "まっする", "話", "どうよ"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "ゲーム":
            keywords = ["ゲーム", "ARK", "参加型", "荒野", "杯", "労働", "ホラー"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "歌枠":
            keywords = ["歌枠", "歌", "🎤", "🎶"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "ASMR":
            keywords = ["ASMR", "囁き", "癒し"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "企画":
            keywords = ["企画", "配信", "特別", "記念", "周年", "カウントダウン"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "コラボ":
            keywords = ["コラボ", "やかまし", "食事会", "ホロメン"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "3D":
            keywords = ["3D", "立体"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "記念":
            keywords = ["記念", "周年", "お祝い", "祝"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "同時視聴":
            keywords = ["同時視聴", "一緒に見る", "みんなで"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "耐久":
            keywords = ["耐久", "長時間", "マラソン"]
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
    
    return list(set(matched_tags))  # 重複除去

def main():
    """メイン処理"""
    import os
    from datetime import datetime
    
    conn = connect_db()
    
    try:
        # データ取得
        stream_tags = get_stream_tags(conn)
        stream_data = get_stream_data(conn)
        
        # CSV出力用データを準備
        csv_data = []
        
        for video_id, title in stream_data:
            matched_tag_ids = extract_tags_from_title(title, stream_tags)
            
            if matched_tag_ids:
                # タグ名のリストを作成
                tag_names = [stream_tags[tag_id] for tag_id in matched_tag_ids]
                
                csv_data.append([
                    video_id,
                    title,
                    ' '.join(map(str, matched_tag_ids)),  # tag_idsを半角スペース区切り
                    ' '.join(tag_names)  # tag_namesを半角スペース区切り
                ])
        
        # 出力ディレクトリの設定
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_dir = os.path.join(base_dir, 'output', 'stream_tags')
        
        # ディレクトリが存在しない場合は作成
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # 日時付きファイル名の生成
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = os.path.join(output_dir, f'{timestamp}_stream_tags.csv')
        
        # CSV出力
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['stream_id', 'title', 'stream_tag_id', 'stream_tag_names'])
            writer.writerows(csv_data)
        
        # 最新ファイルへのシンボリックリンク作成
        latest_link = os.path.join(output_dir, 'latest.csv')
        if os.path.exists(latest_link):
            os.remove(latest_link)
        os.symlink(os.path.basename(output_file), latest_link)
        
        print(f"CSV出力完了: {output_file}")
        print(f"処理件数: {len(csv_data)}件")
        print(f"最新ファイル: {latest_link}")
        
    finally:
        conn.close()

if __name__ == "__main__":
    main()