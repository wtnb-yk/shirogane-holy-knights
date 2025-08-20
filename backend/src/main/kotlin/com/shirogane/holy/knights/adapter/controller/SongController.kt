package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.PerformedSongSearchParamsDto
import com.shirogane.holy.knights.application.dto.PerformedSongSearchResultDto
import com.shirogane.holy.knights.application.dto.PerformedSongStatsDto
import com.shirogane.holy.knights.application.port.`in`.SongUseCasePort
import org.springframework.stereotype.Component

@Component
class SongController(
    private val songUseCase: SongUseCasePort
) {
    suspend fun searchPerformedSongs(params: PerformedSongSearchParamsDto): PerformedSongSearchResultDto {
        val result = songUseCase.searchPerformedSongs(params)
        return result
    }
    
    suspend fun getPerformedSongsStats(): PerformedSongStatsDto {
        val result = songUseCase.getPerformedSongsStats()
        return result
    }
}