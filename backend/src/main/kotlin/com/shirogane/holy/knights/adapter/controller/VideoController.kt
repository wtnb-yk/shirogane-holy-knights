package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import org.springframework.stereotype.Component

@Component
class VideoController(
    private val videoUseCase: VideoUseCasePort
): Controller {
    suspend fun searchVideos(params: VideoSearchParamsDto) =
        videoUseCase.searchVideos(params)
            .fold(
                { it.toResponse() },
                { it }
            )
    
    suspend fun searchStreams(params: StreamSearchParamsDto) =
        videoUseCase.searchStreams(params)
            .fold(
                { it.toResponse() },
                { it }
            )
    
    suspend fun getAllStreamTags() = 
        videoUseCase.getAllStreamTags()
    
    suspend fun getAllVideoTags() =
        videoUseCase.getAllVideoTags()
}
