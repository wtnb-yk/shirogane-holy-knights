package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSearchResultDto
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

    /**
     * 配信検索 - フロントエンド用エンドポイント
     */
    @PostMapping("/streams")
    suspend fun streamSearch(@RequestBody params: StreamSearchParamsDto): ResponseEntity<StreamSearchResultDto> {
        logger.info("streamSearch called with params: $params")
        
        return try {
            val result = videoUseCase.searchStreams(params)
            logger.info("streamSearch returning ${result.items.size} items")
            ResponseEntity.ok(result)
        } catch (error: Exception) {
            logger.error("Error in streamSearch", error)
            ResponseEntity.internalServerError().body(
                StreamSearchResultDto(
                    items = emptyList(),
                    totalCount = 0,
                    page = params.page,
                    pageSize = params.pageSize,
                    hasMore = false
                )
            )
        }
    }

    /**
     * 配信タグ一覧取得
     */
    @GetMapping("/stream-tags")
    suspend fun getStreamTags(): ResponseEntity<List<String>> {
        logger.info("getStreamTags called")
        
        return try {
            val tags = videoUseCase.getAllStreamTags()
            logger.info("getStreamTags returning ${tags.size} tags")
            ResponseEntity.ok(tags)
        } catch (error: Exception) {
            logger.error("Error in getStreamTags", error)
            ResponseEntity.internalServerError().body(emptyList())
        }
    }

    /**
     * 動画タグ一覧取得
     */
    @GetMapping("/video-tags")
    suspend fun getVideoTags(): ResponseEntity<List<String>> {
        logger.info("getVideoTags called")
        
        return try {
            val tags = videoUseCase.getAllVideoTags()
            logger.info("getVideoTags returning ${tags.size} tags")
            ResponseEntity.ok(tags)
        } catch (error: Exception) {
            logger.error("Error in getVideoTags", error)
            ResponseEntity.internalServerError().body(emptyList())
        }
    }
}
