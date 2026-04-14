package com.shirogane.holy.knights.adapter.controller.port

import arrow.core.Either
import com.shirogane.holy.knights.adapter.controller.dto.SongSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.StreamSongSearchResultDto
import com.shirogane.holy.knights.adapter.controller.dto.StreamSongStatsDto
import com.shirogane.holy.knights.application.usecase.UseCaseError

/**
 * 楽曲ユースケース入力ポート
 */
interface SongUseCasePort {
    /**
     * 楽曲検索
     * @param searchParams 検索条件
     * @return 楽曲検索結果DTO
     */
    suspend fun searchStreamSongs(searchParams: SongSearchParamsDto): Either<UseCaseError, StreamSongSearchResultDto>
    
    /**
     * 楽曲統計情報取得
     * @return 楽曲統計情報DTO
     */
    suspend fun getStreamSongsStats(): Either<UseCaseError, StreamSongStatsDto>
    
    /**
     * コンサート楽曲検索
     * @param searchParams 検索条件
     * @return コンサート楽曲検索結果DTO
     */
    suspend fun searchConcertSongs(searchParams: SongSearchParamsDto): Either<UseCaseError, StreamSongSearchResultDto>
    
    /**
     * コンサート楽曲統計情報取得
     * @return コンサート楽曲統計情報DTO
     */
    suspend fun getConcertSongsStats(): Either<UseCaseError, StreamSongStatsDto>
}
