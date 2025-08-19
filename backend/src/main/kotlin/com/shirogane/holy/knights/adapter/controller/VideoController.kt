package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSearchResultDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import org.springframework.stereotype.Component

@Component
class VideoController(
    private val videoUseCase: VideoUseCasePort
) {
    suspend fun searchVideos(params: VideoSearchParamsDto): VideoSearchResultDto {
        val result = videoUseCase.searchVideos(params)
        return result
    }
    
    suspend fun searchStreams(params: StreamSearchParamsDto): StreamSearchResultDto {
        val result = videoUseCase.searchStreams(params)
        return result
    }
    
    suspend fun getAllStreamTags(): List<String> {
        val tags = videoUseCase.getAllStreamTags()
        return tags
    }
    
    suspend fun getAllVideoTags(): List<String> {
        val tags = videoUseCase.getAllVideoTags()
        return tags
    }
}
