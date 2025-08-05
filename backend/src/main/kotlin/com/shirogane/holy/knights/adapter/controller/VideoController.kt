package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.VideoDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * 動画関連のAPIエンドポイント
 */
@RestController
class VideoController(private val videoUseCase: VideoUseCasePort) {

    private val logger = LoggerFactory.getLogger(VideoController::class.java)

    /**
     * 動画検索 - フロントエンド用エンドポイント
     */
    @PostMapping("/videos")
    suspend fun videoSearch(@RequestBody params: VideoSearchParamsDto): ResponseEntity<VideoSearchResultDto> {
        logger.info("videoSearch called with params: $params")
        
        return try {
            val result = videoUseCase.searchVideos(params)
            logger.info("videoSearch returning ${result.items.size} items")
            ResponseEntity.ok(result)
        } catch (error: Exception) {
            logger.error("Error in videoSearch", error)
            ResponseEntity.internalServerError().body(
                VideoSearchResultDto(
                    items = emptyList(),
                    totalCount = 0,
                    page = params.page,
                    pageSize = params.pageSize,
                    hasMore = false
                )
            )
        }
    }
}
