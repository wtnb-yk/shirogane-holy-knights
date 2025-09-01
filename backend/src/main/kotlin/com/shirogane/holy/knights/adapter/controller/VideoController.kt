package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.port.VideoUseCasePort
import org.springframework.stereotype.Component

@Component
class VideoController(
    private val videoUseCase: VideoUseCasePort,
    override val objectMapper: ObjectMapper
): Controller {
    suspend fun searchVideos(requestBody: String?) =
        videoUseCase.searchVideos(parseRequestBody(requestBody, VideoSearchParamsDto::class.java) ?: VideoSearchParamsDto())
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
    
    suspend fun searchStreams(requestBody: String?) =
        videoUseCase.searchStreams(parseRequestBody(requestBody, StreamSearchParamsDto::class.java) ?: StreamSearchParamsDto())
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
    
    suspend fun getAllStreamTags() = 
        ApiResponse(200, videoUseCase.getAllStreamTags())
    
    suspend fun getAllVideoTags() =
        ApiResponse(200, videoUseCase.getAllVideoTags())
}
