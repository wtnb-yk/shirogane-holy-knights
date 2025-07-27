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
@RequestMapping("/api/archives")
@CrossOrigin(origins = ["*"])
class ArchiveController(private val archiveUseCase: ArchiveUseCasePort) {

    private val logger = LoggerFactory.getLogger(ArchiveController::class.java)

    /**
     * アーカイブ一覧取得
     */
    @GetMapping("")
    fun getArchives(
        @RequestParam(defaultValue = "1") page: Int,
        @RequestParam(defaultValue = "20") pageSize: Int
    ): Mono<ResponseEntity<ArchiveSearchResultDto>> {
        logger.info("アーカイブ一覧取得リクエスト: page=$page, pageSize=$pageSize")
        
        return Mono.fromCallable {
            runBlocking { archiveUseCase.getAllArchives(page, pageSize) }
        }.map { result ->
            ResponseEntity.ok(result)
        }.onErrorReturn(
            ResponseEntity.internalServerError().body(
                ArchiveSearchResultDto(
                    items = emptyList(),
                    totalCount = 0,
                    page = page,
                    pageSize = pageSize,
                    hasMore = false
                )
            )
        )
    }

    /**
     * アーカイブ検索
     */
    @GetMapping("/search")
    fun searchArchives(
        @RequestParam query: String?,
        @RequestParam tags: List<String>?,
        @RequestParam startDate: String?,
        @RequestParam endDate: String?,
        @RequestParam(defaultValue = "1") page: Int,
        @RequestParam(defaultValue = "20") pageSize: Int
    ): Mono<ResponseEntity<ArchiveSearchResultDto>> {
        logger.info("アーカイブ検索リクエスト: query=$query, tags=$tags")
        
        val searchParams = ArchiveSearchParamsDto(
            query = query,
            tags = tags,
            startDate = startDate,
            endDate = endDate,
            page = page,
            pageSize = pageSize
        )
        
        return Mono.fromCallable {
            runBlocking { archiveUseCase.searchArchives(searchParams) }
        }.map { result ->
            ResponseEntity.ok(result)
        }.onErrorReturn(
            ResponseEntity.internalServerError().body(
                ArchiveSearchResultDto(
                    items = emptyList(),
                    totalCount = 0,
                    page = page,
                    pageSize = pageSize,
                    hasMore = false
                )
            )
        )
    }

    /**
     * アーカイブ詳細取得
     */
    @GetMapping("/{id}")
    fun getArchive(@PathVariable id: String): Mono<ResponseEntity<ArchiveDto?>> {
        logger.info("アーカイブ詳細取得リクエスト: id=$id")
        
        return Mono.fromCallable {
            runBlocking { archiveUseCase.getArchiveById(id) }
        }.map { archive ->
            if (archive != null) {
                ResponseEntity.ok(archive)
            } else {
                ResponseEntity.notFound().build()
            }
        }.onErrorReturn(
            ResponseEntity.internalServerError().build()
        )
    }

    /**
     * 関連アーカイブ取得
     */
    @GetMapping("/{id}/related")
    fun getRelatedArchives(
        @PathVariable id: String,
        @RequestParam(defaultValue = "5") limit: Int
    ): Mono<ResponseEntity<List<ArchiveDto>>> {
        logger.info("関連アーカイブ取得リクエスト: id=$id, limit=$limit")
        
        return Mono.fromCallable {
            runBlocking { archiveUseCase.getRelatedArchives(id, limit) }
        }.map { relatedArchives ->
            ResponseEntity.ok(relatedArchives)
        }.onErrorReturn(
            ResponseEntity.ok(emptyList())
        )
    }
}