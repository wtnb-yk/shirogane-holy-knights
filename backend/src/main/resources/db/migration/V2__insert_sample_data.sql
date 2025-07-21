-- サンプルアーカイブデータの挿入
INSERT INTO archives (id, title, url, published_at, description, duration, thumbnail_url) VALUES
('video001', '【VALORANT】ゆっくり学ぶヴァロラント #1', 'https://youtube.com/watch?v=sample001', '2023-04-01 20:00:00', 'ヴァロラントの基本を紹介します。初心者向け解説動画です。', '01:30:00', 'https://i.ytimg.com/vi/sample001/maxresdefault.jpg'),
('video002', '【Minecraft】ホロ鯖冒険記！城づくり編 #23', 'https://youtube.com/watch?v=sample002', '2023-04-05 21:00:00', '今回は城の塔を作っていきます！', '02:15:00', 'https://i.ytimg.com/vi/sample002/maxresdefault.jpg'),
('video003', '【雑談】最近あったこと話します♪', 'https://youtube.com/watch?v=sample003', '2023-04-08 19:30:00', 'みんなとまったり雑談する配信です。', '01:45:00', 'https://i.ytimg.com/vi/sample003/maxresdefault.jpg'),
('video004', '【歌枠】アニソンいっぱい歌うよ～♪', 'https://youtube.com/watch?v=sample004', '2023-04-12 20:00:00', 'リクエストも受け付けます！一緒に歌おう！', '02:00:00', 'https://i.ytimg.com/vi/sample004/maxresdefault.jpg'),
('video005', '【APEX】ダイヤ目指して頑張る！ソロランク配信', 'https://youtube.com/watch?v=sample005', '2023-04-15 21:00:00', 'APEXのランクマッチ配信です。応援よろしくお願いします！', '03:00:00', 'https://i.ytimg.com/vi/sample005/maxresdefault.jpg'),
('video006', '【ASMR】癒しの囁き♪聞きながら寝てね', 'https://youtube.com/watch?v=sample006', '2023-04-18 23:00:00', '眠れない夜に聞いてください。癒しボイスでリラックス。', '01:00:00', 'https://i.ytimg.com/vi/sample006/maxresdefault.jpg'),
('video007', '【お知らせ】重大発表があります！', 'https://youtube.com/watch?v=sample007', '2023-04-20 19:00:00', '大切なお知らせがあります。ぜひ見てください！', '00:30:00', 'https://i.ytimg.com/vi/sample007/maxresdefault.jpg'),
('video008', '【料理】簡単おいしい！手作りお菓子レシピ', 'https://youtube.com/watch?v=sample008', '2023-04-23 14:00:00', '今回はみんなでクッキー作り！材料も少なくて簡単です♪', '01:15:00', 'https://i.ytimg.com/vi/sample008/maxresdefault.jpg'),
('video009', '【初見歓迎】ホラーゲーム実況！絶叫注意⚠', 'https://youtube.com/watch?v=sample009', '2023-04-26 22:00:00', '怖いの苦手だけど挑戦します...応援してください！', '02:30:00', 'https://i.ytimg.com/vi/sample009/maxresdefault.jpg'),
('video010', '【メンバー限定】おしゃべり会！', 'https://youtube.com/watch?v=sample010', '2023-04-30 20:00:00', 'メンバーシップ限定の特別配信です。ありがとうございます！', '01:30:00', 'https://i.ytimg.com/vi/sample010/maxresdefault.jpg');

-- タグデータの挿入
INSERT INTO tags (name) VALUES
('ゲーム'), 
('VALORANT'), 
('Minecraft'),
('雑談'),
('歌枠'),
('APEX'),
('ASMR'),
('お知らせ'),
('料理'),
('ホラー'),
('メンバー限定');

-- アーカイブとタグの関連付け
-- video001: VALORANT
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video001', (SELECT id FROM tags WHERE name = 'ゲーム')),
('video001', (SELECT id FROM tags WHERE name = 'VALORANT'));

-- video002: Minecraft
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video002', (SELECT id FROM tags WHERE name = 'ゲーム')),
('video002', (SELECT id FROM tags WHERE name = 'Minecraft'));

-- video003: 雑談
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video003', (SELECT id FROM tags WHERE name = '雑談'));

-- video004: 歌枠
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video004', (SELECT id FROM tags WHERE name = '歌枠'));

-- video005: APEX
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video005', (SELECT id FROM tags WHERE name = 'ゲーム')),
('video005', (SELECT id FROM tags WHERE name = 'APEX'));

-- video006: ASMR
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video006', (SELECT id FROM tags WHERE name = 'ASMR'));

-- video007: お知らせ
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video007', (SELECT id FROM tags WHERE name = 'お知らせ'));

-- video008: 料理
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video008', (SELECT id FROM tags WHERE name = '料理'));

-- video009: ホラー
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video009', (SELECT id FROM tags WHERE name = 'ゲーム')),
('video009', (SELECT id FROM tags WHERE name = 'ホラー'));

-- video010: メンバー限定
INSERT INTO archive_tags (archive_id, tag_id) VALUES
('video010', (SELECT id FROM tags WHERE name = 'メンバー限定')),
('video010', (SELECT id FROM tags WHERE name = '雑談'));