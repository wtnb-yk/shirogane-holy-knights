package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.*
import com.shirogane.holy.knights.application.port.`in`.NewsUseCasePort
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * ニュース関連のコントローラー
 * Springのコントローラーとして実装（Lambda環境ではApiGatewayFunctionから呼び出される）
 */
@RestController
class NewsController(private val newsUseCase: NewsUseCasePort) {

    private val logger = LoggerFactory.getLogger(NewsController::class.java)

    /**
     * ニュース検索
     */
    @PostMapping("/news")
    suspend fun searchNews(@RequestBody params: NewsSearchParamsDto): ResponseEntity<NewsSearchResultDto> {
        logger.info("ニュース検索: $params")
        
        return try {
            val result = newsUseCase.searchNews(params)
            logger.info("ニュース検索完了: ${result.items.size}件")
            ResponseEntity.ok(result)
        } catch (error: Exception) {
            logger.error("ニュース検索エラー", error)
            ResponseEntity.internalServerError().body(
                NewsSearchResultDto(
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
     * ニュースカテゴリ一覧取得
     */
    @GetMapping("/news/categories")
    suspend fun getNewsCategories(): ResponseEntity<List<NewsCategoryDto>> {
        logger.info("ニュースカテゴリ一覧取得")
        
        return try {
            val categories = newsUseCase.getNewsCategories()
            logger.info("ニュースカテゴリ一覧取得完了: ${categories.size}件")
            ResponseEntity.ok(categories)
        } catch (error: Exception) {
            logger.error("ニュースカテゴリ一覧取得エラー", error)
            ResponseEntity.internalServerError().body(emptyList())
        }
    }
}
