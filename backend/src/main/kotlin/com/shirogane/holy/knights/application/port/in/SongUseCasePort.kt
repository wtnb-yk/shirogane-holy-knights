package com.shirogane.holy.knights.application.port.`in`

import arrow.core.Either
import com.shirogane.holy.knights.application.dto.StreamSongSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSongSearchResultDto
import com.shirogane.holy.knights.application.dto.StreamSongStatsDto
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
    suspend fun searchStreamSongs(searchParams: StreamSongSearchParamsDto): Either<UseCaseError, StreamSongSearchResultDto>
    
    /**
     * 楽曲統計情報取得
     * @return 楽曲統計情報DTO
     */
    suspend fun getStreamSongsStats(): Either<UseCaseError, StreamSongStatsDto>
}