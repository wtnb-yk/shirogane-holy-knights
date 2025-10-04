package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.dto.SongSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.port.SongUseCasePort
import org.springframework.stereotype.Component

@Component
class SongController(
    private val songUseCase: SongUseCasePort,
    override val objectMapper: ObjectMapper
): Controller {
    suspend fun searchStreamSongs(requestBody: String?) =
        songUseCase.searchStreamSongs(parseRequestBody(requestBody, SongSearchParamsDto::class.java) ?: SongSearchParamsDto())
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
    
    suspend fun getStreamSongsStats() =
        songUseCase.getStreamSongsStats()
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )

    suspend fun searchConcertSongs(requestBody: String?) =
        songUseCase.searchConcertSongs(parseRequestBody(requestBody, SongSearchParamsDto::class.java) ?: SongSearchParamsDto())
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
    
    suspend fun getConcertSongsStats() =
        songUseCase.getConcertSongsStats()
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
}
