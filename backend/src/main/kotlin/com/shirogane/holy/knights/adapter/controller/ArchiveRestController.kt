package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.ArchiveDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchParamsDto
import com.shirogane.holy.knights.application.dto.ArchiveSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * アーカイブRESTコントローラー
 * HTTPリクエストを受け付け、ユースケースに処理を委譲し、結果をレスポンスとして返す
 */
@RestController
@RequestMapping("/api/v1/archives")
class ArchiveRestController(private val archiveUseCase: ArchiveUseCasePort) {

    private val logger = LoggerFactory.getLogger(ArchiveRestController::class.java)
    
    /**
     * アーカイブ一覧を取得
     */
    @GetMapping
    fun getAllArchives(
        @RequestParam(defaultValue = "1") page: Int,
        @RequestParam(defaultValue = "20") pageSize: Int
    ): ResponseEntity<Any> {
        return try {
            val result = archiveUseCase.getAllArchives(page, pageSize)
            ResponseEntity.ok(result)
        } catch (e: Exception) {
            logger.error("アーカイブ一覧取得エラー", e)
            ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "アーカイブ一覧の取得中にエラーが発生しました"))
        }
    }
    
    /**
     * IDによるアーカイブ詳細取得
     */
    @GetMapping("/{id}")
    suspend fun getArchiveById(@PathVariable id: String): ResponseEntity<Any> {
        return try {
            val archive = archiveUseCase.getArchiveById(id)
            if (archive != null) {
                ResponseEntity.ok(archive)
            } else {
                ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(mapOf("error" to "指定されたIDのアーカイブが見つかりません"))
            }
        } catch (e: Exception) {
            logger.error("アーカイブ詳細取得エラー", e)
            ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "アーカイブ詳細の取得中にエラーが発生しました"))
        }
    }
    
    /**
     * アーカイブ検索
     */
    @GetMapping("/search")
    suspend fun searchArchives(
        @RequestParam(required = false) query: String?,
        @RequestParam(required = false) tags: String?,
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?,
        @RequestParam(defaultValue = "1") page: Int,
        @RequestParam(defaultValue = "20") pageSize: Int
    ): ResponseEntity<Any> {
        return try {
            val tagsList = tags?.split(",")
            
            val searchParams = ArchiveSearchParamsDto(
                query = query,
                tags = tagsList,
                startDate = startDate,
                endDate = endDate,
                page = page,
                pageSize = pageSize
            )
            
            val result = archiveUseCase.searchArchives(searchParams)
            ResponseEntity.ok(result)
        } catch (e: Exception) {
            logger.error("アーカイブ検索エラー", e)
            ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "アーカイブ検索中にエラーが発生しました"))
        }
    }
    
    /**
     * 関連アーカイブ取得
     */
    @GetMapping("/{id}/related")
    suspend fun getRelatedArchives(
        @PathVariable id: String,
        @RequestParam(defaultValue = "5") limit: Int
    ): ResponseEntity<Any> {
        return try {
            val relatedArchives = archiveUseCase.getRelatedArchives(id, limit)
            ResponseEntity.ok(relatedArchives)
        } catch (e: Exception) {
            logger.error("関連アーカイブ取得エラー", e)
            ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "関連アーカイブの取得中にエラーが発生しました"))
        }
    }
    
    /**
     * ヘルスチェックエンドポイント
     */
    @GetMapping("/health")
    fun healthCheck(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.ok(mapOf("status" to "OK"))
    }
}