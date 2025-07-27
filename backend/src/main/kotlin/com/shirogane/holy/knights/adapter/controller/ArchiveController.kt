package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.ArchiveDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchParamsDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

/**
 * アーカイブ関連のAPIエンドポイント
 */
@RestController
class ArchiveController(private val archiveUseCase: ArchiveUseCasePort) {

    private val logger = LoggerFactory.getLogger(ArchiveController::class.java)

    /**
     * アーカイブ検索 - フロントエンド用エンドポイント
     */
    @PostMapping("/archiveSearch")
    fun archiveSearch(@RequestBody params: ArchiveSearchParamsDto): Mono<ResponseEntity<ArchiveSearchResultDto>> {
        logger.info("archiveSearch called with params: $params")
        
        return Mono.fromCallable {
            runBlocking { archiveUseCase.searchArchives(params) }
        }.map { result ->
            logger.info("archiveSearch returning ${result.items.size} items")
            ResponseEntity.ok(result)
        }.doOnError { error ->
            logger.error("Error in archiveSearch", error)
        }.onErrorReturn(
            ResponseEntity.internalServerError().body(
                ArchiveSearchResultDto(
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