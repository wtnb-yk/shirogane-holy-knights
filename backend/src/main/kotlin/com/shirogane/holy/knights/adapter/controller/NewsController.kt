package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.*
import com.shirogane.holy.knights.application.port.`in`.NewsUseCasePort
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

/**
 * ニュース関連のコントローラー
 * Springのコントローラーとして実装（Lambda環境ではApiGatewayFunctionから呼び出される）
 */
@RestController
class NewsController(private val newsUseCase: NewsUseCasePort) {

    private val logger = LoggerFactory.getLogger(NewsController::class.java)

    /**
     * ニュース一覧取得
     */
    @PostMapping("/newsList")
    fun getNewsList(@RequestBody params: NewsListParamsDto): Mono<ResponseEntity<NewsSearchResultDto>> {
        logger.info("ニュース一覧取得: $params")
        
        return Mono.fromCallable {
            runBlocking { newsUseCase.getNewsList(params) }
        }.map { result ->
            logger.info("ニュース一覧取得完了: ${result.items.size}件")
            ResponseEntity.ok(result)
        }.doOnError { error ->
            logger.error("ニュース一覧取得エラー", error)
        }.onErrorReturn(
            ResponseEntity.internalServerError().body(
                NewsSearchResultDto(
                    items = emptyList(),
                    totalCount = 0,
                    page = params.page,
                    pageSize = params.pageSize,
                    hasMore = false
                )
            )
        )
    }

    /**
     * ニュース検索
     */
    @PostMapping("/newsSearch")
    fun searchNews(@RequestBody params: NewsSearchParamsDto): Mono<ResponseEntity<NewsSearchResultDto>> {
        logger.info("ニュース検索: $params")
        
        return Mono.fromCallable {
            runBlocking { newsUseCase.searchNews(params) }
        }.map { result ->
            logger.info("ニュース検索完了: ${result.items.size}件")
            ResponseEntity.ok(result)
        }.doOnError { error ->
            logger.error("ニュース検索エラー", error)
        }.onErrorReturn(
            ResponseEntity.internalServerError().body(
                NewsSearchResultDto(
                    items = emptyList(),
                    totalCount = 0,
                    page = params.page,
                    pageSize = params.pageSize,
                    hasMore = false
                )
            )
        )
    }


    /**
     * ニュースカテゴリ一覧取得
     */
    @GetMapping("/news/categories")
    fun getNewsCategories(): Mono<ResponseEntity<List<NewsCategoryDto>>> {
        logger.info("ニュースカテゴリ一覧取得")
        
        return Mono.fromCallable {
            runBlocking { newsUseCase.getNewsCategories() }
        }.map { categories ->
            logger.info("ニュースカテゴリ一覧取得完了: ${categories.size}件")
            ResponseEntity.ok(categories)
        }.doOnError { error ->
            logger.error("ニュースカテゴリ一覧取得エラー", error)
        }.onErrorReturn(ResponseEntity.internalServerError().body(emptyList()))
    }
}