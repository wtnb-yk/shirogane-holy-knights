package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.StreamSongSearchParamsDto
import com.shirogane.holy.knights.application.port.`in`.SongUseCasePort
import org.springframework.stereotype.Component

@Component
class SongController(
    private val songUseCase: SongUseCasePort
): Controller {
    suspend fun searchStreamSongs(params: StreamSongSearchParamsDto) =
        songUseCase.searchStreamSongs(params)
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
    
    suspend fun getStreamSongsStats() =
        songUseCase.getStreamSongsStats()
            .fold(
                { ApiResponse(400, it.toResponse()) },
                { ApiResponse(200, it) }
            )
}
