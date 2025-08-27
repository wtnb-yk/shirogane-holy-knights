package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.common.PageResponse
import com.shirogane.holy.knights.application.dto.*
import com.shirogane.holy.knights.application.port.`in`.NewsUseCasePort
import com.shirogane.holy.knights.domain.repository.NewsRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class NewsUseCaseImpl(
    private val newsRepository: NewsRepository
) : NewsUseCasePort {

    private val logger = LoggerFactory.getLogger(NewsUseCaseImpl::class.java)

    override suspend fun searchNews(params: NewsSearchParamsDto): NewsSearchResultDto {
        logger.info("ニュース検索ユースケース実行（統合版）: $params")
        
        try {
            val pageRequest = params.toPageRequest()
            val startDate = params.startDate?.let { Instant.parse(it) }
            val endDate = params.endDate?.let { Instant.parse(it) }
            
            val newsList = newsRepository.search(
                query = params.query,
                categoryIds = params.categoryIds,
                startDate = startDate,
                endDate = endDate,
                limit = pageRequest.size,
                offset = pageRequest.offset
            )
            
            val totalCount = newsRepository.countBySearchCriteria(
                query = params.query,
                categoryIds = params.categoryIds,
                startDate = startDate,
                endDate = endDate
            )
            
            val newsDto = newsList.map { NewsDto.fromDomain(it) }
            val pageResponse = PageResponse.of(newsDto, totalCount, pageRequest)
            
            return NewsSearchResultDto(
                items = pageResponse.content,
                totalCount = pageResponse.totalElements,
                page = pageResponse.page,
                pageSize = pageResponse.size,
                hasMore = pageResponse.hasMore
            )
        } catch (e: Exception) {
            logger.error("ニュース検索エラー", e)
            return NewsSearchResultDto(
                items = emptyList(),
                totalCount = 0,
                page = params.page,
                pageSize = params.pageSize,
                hasMore = false
            )
        }
    }


    override suspend fun getNewsCategories(): List<NewsCategoryDto> {
        logger.info("ニュースカテゴリ一覧取得ユースケース実行")
        
        return try {
            val categories = newsRepository.findAllCategories()
            categories.map { NewsCategoryDto.fromDomain(it) }
        } catch (e: Exception) {
            logger.error("ニュースカテゴリ一覧取得エラー", e)
            emptyList()
        }
    }
}
