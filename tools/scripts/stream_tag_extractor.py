#!/usr/bin/env python3
import psycopg2
import csv
import re
from typing import List, Dict, Tuple, Optional
from datetime import datetime, time
import json

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

def get_stream_data(conn) -> List[Tuple[str, str, str, Optional[str], Optional[str], Optional[str]]]:
    """配信データを取得（多次元特徴量を含む）"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT v.id, v.title, v.description, v.duration, sd.started_at, v.published_at
        FROM videos v 
        JOIN stream_details sd ON v.id = sd.video_id
        ORDER BY sd.started_at DESC
    """)
    return cursor.fetchall()

def extract_time_features(started_at: Optional[str]) -> Dict[str, any]:
    """時間的特徴量を抽出"""
    if not started_at:
        return {}
    
    try:
        dt = datetime.fromisoformat(str(started_at).replace('Z', '+00:00'))
        return {
            'hour': dt.hour,
            'weekday': dt.weekday(),
            'is_morning': 0 <= dt.hour < 12,
            'is_late_night': 22 <= dt.hour or dt.hour < 6
        }
    except:
        return {}

def parse_duration(duration: Optional[str]) -> int:
    """配信時間（分）を抽出"""
    if not duration or duration == '00:00:00':
        return 0
    
    try:
        # HH:MM:SS 形式をパース
        parts = duration.split(':')
        if len(parts) == 3:
            hours, minutes, seconds = map(int, parts)
            return hours * 60 + minutes + (1 if seconds > 30 else 0)
        return 0
    except:
        return 0

def extract_tags_from_multi_features(title: str, description: Optional[str], duration: Optional[str], 
                                    started_at: Optional[str], available_tags: Dict[int, str]) -> List[int]:
    """多次元特徴量からタグを導出"""
    matched_tags = []
    
    # テキスト特徴量の準備
    title_lower = title.lower()
    description_lower = (description or '').lower()
    combined_text = f"{title} {description or ''}".lower()
    
    # 時間的特徴量
    time_features = extract_time_features(started_at)
    duration_minutes = parse_duration(duration)
    
    # 各タグがタイトルに含まれるかチェック
    for tag_id, tag_name in available_tags.items():
        # 基本的なキーワードマッチング（タイトルのみ）
        if tag_name in title:
            matched_tags.append(tag_id)
            continue
            
        # より詳細なルールベースマッチング（多次元判定）
        if tag_name == "雑談":
            keywords = ["雑談", "朝活"]
            morning_keywords = ["おは", "まっする"]
            is_morning_stream = time_features.get('is_morning', False) and any(k in title for k in morning_keywords)
            
            # より厳密な条件：明示的なキーワードまたは朝活配信のみ
            if any(keyword in title for keyword in keywords) or is_morning_stream:
                matched_tags.append(tag_id)
                
        elif tag_name == "ゲーム":
            keywords = [
                # 既存キーワード
                "ゲーム", "ARK", "荒野", "杯", "労働", "ホラー", "プレイ", "クリア", "挑戦",
                # 頻出ゲームタイトル
                "ポケモン", "ポケットモンスター", 
                "Minecraft", "マイクラ", "マインクラフト",
                "モンハン", "モンスターハンター", "ワイルズ", "MonHun",
                "エルデンリング", "ELDEN RING", "ナイトレイン",
                "R.E.P.O.", "Backrooms", "バックルーム", "Escape the",
                "RUST", "ラスト", "holoRUST",
                "HoloCure", "ホロキュア",
                "パワプロ", "甲子園", "野球", "ミリしら",
                "FF14", "FINAL FANTASY", "ファイナルファンタジー",
                "ドンキーコング", "首都高バトル",
                "TCG Card Shop", "Liar's Bar", "Liar",
                "空気読み", "心霊物件", "お宝マウンテン",
                "白猫プロジェクト", "FORK ROAD", "Among", "AmongUs",
                "ゴブリン", "呪われたデジカメ",
                "デュエルマスターズ", "デュエマ",
                "あつまれ どうぶつの森", "どうぶつの森", "あつ森",
                "ネタバレが激しすぎる", "RPG", "OBT", "ベータ",
                "麻雀", "格闘倶楽部", "視聴者対局", "対戦", "競技"
            ]
            # ゲームタイトルが含まれるか、ゲーム関連の番号表記があるか
            has_game_number = bool(re.search(r'#\d+', title))  # #01, #02 etc.
            
            # ゲーム判定：タイトルにキーワード または 番号表記
            if any(keyword in title for keyword in keywords) or has_game_number:
                matched_tags.append(tag_id)
                
        elif tag_name == "歌枠":
            keywords = ["歌枠", "歌", "🎤", "🎶", "歌う", "song", "sing", "リレー", "cover", "歌ってみた"]
            # 歌枠は明示的なキーワードのみで判定
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "ASMR":
            keywords = ["ASMR", "囁き", "癒し", "耳かき", "マッサージ", "安眠", "夢の世界", "お耳", "ぐっすり"]
            # ASMRは明示的なキーワードのみで判定
            if any(keyword in title for keyword in keywords):
                matched_tags.append(tag_id)
                
        elif tag_name == "企画":
            keywords = ["企画", "記念", "周年", "カウントダウン", "イベント", "祭", "大会", "杯"]
            # 企画判定：ハッシュタグ（番号以外）または明示的キーワード
            has_hashtag = "#" in title and not re.search(r'^#\d+', title)  # 番号のハッシュタグは除外
            has_explicit_keywords = any(keyword in title for keyword in keywords)
            
            if has_hashtag or has_explicit_keywords:
                matched_tags.append(tag_id)
                
        elif tag_name == "コラボ":
            # コラボ判定：非常に明示的なキーワードのみ
            if any(keyword in title for keyword in ["コラボ", "やかまし", "オフコラボ", "BIG3"]):
                matched_tags.append(tag_id)
                
                
        elif tag_name == "記念":
            keywords = ["記念", "周年", "お祝い", "祝", "生誕", "誕生日", "万人", "2000日", "カウントダウン"]
            # 記念判定：明示的なキーワードまたは記念数字
            has_milestone = bool(re.search(r'\d+周年|\d+万人|\d+日記念', title))
            
            if any(keyword in title for keyword in keywords) or has_milestone:
                matched_tags.append(tag_id)
                
        elif tag_name == "同時視聴":
            # 同時視聴：明示的なキーワードのみ
            if any(keyword in title for keyword in ["同時視聴", "watchalong"]):
                matched_tags.append(tag_id)
                
                
        elif tag_name == "参加型":
            # 参加型判定：非常に明示的なキーワードのみ
            if any(keyword in title for keyword in ["参加型", "視聴者参加", "視聴者対局"]):
                matched_tags.append(tag_id)
                
                
        elif tag_name == "ライブ":
            # ライブ判定：明示的なキーワードのみ
            if any(keyword in title for keyword in ["LIVE", "ライブ", "Live", "生誕祭"]):
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
        
        for video_id, title, description, duration, started_at, published_at in stream_data:
            matched_tag_ids = extract_tags_from_multi_features(title, description, duration, started_at, stream_tags)
            
            # タグ名のリストを作成（マッチしない場合は空のリスト）
            tag_names = [stream_tags[tag_id] for tag_id in matched_tag_ids] if matched_tag_ids else []
            
            csv_data.append([
                video_id,
                title,
                str(started_at),  # started_atを追加
                ' '.join(map(str, matched_tag_ids)) if matched_tag_ids else '',  # tag_idsを半角スペース区切り（空の場合は空文字）
                ' '.join(tag_names) if tag_names else ''  # tag_namesを半角スペース区切り（空の場合は空文字）
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
            writer.writerow(['stream_id', 'title', 'started_at', 'stream_tag_id', 'stream_tag_names'])
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