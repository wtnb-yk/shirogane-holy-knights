package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.dto.*
import com.shirogane.holy.knights.adapter.controller.port.VideoUseCasePort
import org.springframework.stereotype.Component

@Component
class VideoController(
    private val videoUseCase: VideoUseCasePort,
    override val objectMapper: ObjectMapper
): Controller {
    
    /**
     * 動画検索（最適化されたレスポンス）
     */
    suspend fun searchVideos(requestBody: String?) =
        videoUseCase.searchVideos(parseRequestBody(requestBody, VideoSearchParamsDto::class.java) ?: VideoSearchParamsDto())
            .fold(
                { it.toResponse() },
                { result ->
                    // 最適化されたDTOに変換
                    val optimizedResult = OptimizedSearchResultDto.of(
                        items = result.items.map { 
                            OptimizedVideoDto(
                                id = it.id,
                                title = it.title,
                                publishedAt = it.publishedAt,
                                thumbnailUrl = it.thumbnailUrl,
                                duration = it.duration,
                                tags = it.tags
                            )
                        },
                        totalCount = result.totalCount,
                        pageRequest = (parseRequestBody(requestBody, VideoSearchParamsDto::class.java) ?: VideoSearchParamsDto()).toPageRequest()
                    )
                    ApiResponse(200, optimizedResult)
                }
            )
    
    /**
     * 配信検索（最適化されたレスポンス）
     */
    suspend fun searchStreams(requestBody: String?) =
        videoUseCase.searchStreams(parseRequestBody(requestBody, StreamSearchParamsDto::class.java) ?: StreamSearchParamsDto())
            .fold(
                { it.toResponse() },
                { result ->
                    // 最適化されたDTOに変換
                    val optimizedResult = OptimizedSearchResultDto.of(
                        items = result.items.map { 
                            OptimizedStreamDto(
                                id = it.id,
                                title = it.title,
                                startedAt = it.startedAt,
                                thumbnailUrl = it.thumbnailUrl,
                                tags = it.tags
                            )
                        },
                        totalCount = result.totalCount,
                        pageRequest = (parseRequestBody(requestBody, StreamSearchParamsDto::class.java) ?: StreamSearchParamsDto()).toPageRequest()
                    )
                    ApiResponse(200, optimizedResult)
                }
            )
    
    /**
     * 動画検索（詳細情報付き）- 既存の完全なレスポンス
     */
    suspend fun searchVideosDetailed(requestBody: String?) =
        videoUseCase.searchVideos(parseRequestBody(requestBody, VideoSearchParamsDto::class.java) ?: VideoSearchParamsDto())
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
    
    /**
     * 配信検索（詳細情報付き）- 既存の完全なレスポンス
     */
    suspend fun searchStreamsDetailed(requestBody: String?) =
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
