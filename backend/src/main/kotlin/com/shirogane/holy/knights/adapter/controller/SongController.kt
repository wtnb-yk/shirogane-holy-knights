package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.StreamSongSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSongSearchResultDto
import com.shirogane.holy.knights.application.dto.StreamSongStatsDto
import com.shirogane.holy.knights.application.port.`in`.SongUseCasePort
import org.springframework.stereotype.Component

@Component
class SongController(
    private val songUseCase: SongUseCasePort
) {
    suspend fun searchStreamSongs(params: StreamSongSearchParamsDto): StreamSongSearchResultDto {
        val result = songUseCase.searchStreamSongs(params)
        return result
    }
    
    suspend fun getStreamSongsStats(): StreamSongStatsDto {
        val result = songUseCase.getStreamSongsStats()
        return result
    }
}