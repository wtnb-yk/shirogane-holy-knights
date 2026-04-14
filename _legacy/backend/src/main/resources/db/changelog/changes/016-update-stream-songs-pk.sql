--liquibase formatted sql

--changeset shirogane:016-update-stream-songs-pk
--comment: stream_songsとconcert_songsのPRIMARY KEYを変更（同一動画内での同一曲の複数回演奏に対応）

-- stream_songsテーブルのPRIMARY KEY変更
ALTER TABLE stream_songs DROP CONSTRAINT stream_songs_pkey;
ALTER TABLE stream_songs ADD PRIMARY KEY (song_id, video_id, start_seconds);

-- concert_songsテーブルのPRIMARY KEY変更（一貫性のため）
ALTER TABLE concert_songs DROP CONSTRAINT concert_songs_pkey;
ALTER TABLE concert_songs ADD PRIMARY KEY (song_id, video_id, start_seconds);

--rollback ALTER TABLE concert_songs DROP CONSTRAINT concert_songs_pkey;
--rollback ALTER TABLE concert_songs ADD PRIMARY KEY (song_id, video_id);
--rollback ALTER TABLE stream_songs DROP CONSTRAINT stream_songs_pkey;
--rollback ALTER TABLE stream_songs ADD PRIMARY KEY (song_id, video_id);