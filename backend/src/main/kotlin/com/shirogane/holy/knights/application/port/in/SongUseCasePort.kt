package com.shirogane.holy.knights.application.port.`in`

import com.shirogane.holy.knights.application.dto.PerformedSongSearchParamsDto
import com.shirogane.holy.knights.application.dto.PerformedSongSearchResultDto
import com.shirogane.holy.knights.application.dto.PerformedSongStatsDto

/**
 * 楽曲ユースケース入力ポート
 */
interface SongUseCasePort {
    /**
     * 楽曲検索
     * @param searchParams 検索条件
     * @return 楽曲検索結果DTO
     */
    suspend fun searchPerformedSongs(searchParams: PerformedSongSearchParamsDto): PerformedSongSearchResultDto
    
    /**
     * 楽曲統計情報取得
     * @return 楽曲統計情報DTO
     */
    suspend fun getPerformedSongsStats(): PerformedSongStatsDto
}