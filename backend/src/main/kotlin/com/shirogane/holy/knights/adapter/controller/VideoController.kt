package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.VideoDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers

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
    fun videoSearch(@RequestBody params: VideoSearchParamsDto): Mono<ResponseEntity<VideoSearchResultDto>> {
        logger.info("videoSearch called with params: $params")
        
        return Mono.fromCallable {
            runBlocking { videoUseCase.searchVideos(params) }
        }.subscribeOn(Schedulers.boundedElastic())
        .map { result ->
            logger.info("videoSearch returning ${result.items.size} items")
            ResponseEntity.ok(result)
        }.doOnError { error ->
            logger.error("Error in videoSearch", error)
        }.onErrorReturn(
            ResponseEntity.internalServerError().body(
                VideoSearchResultDto(
                    items = emptyList(),
                    totalCount = 0,
                    page = params.page ?: 1,
                    pageSize = params.pageSize ?: 20,
                    hasMore = false
                )
            )
        )
    }
}
