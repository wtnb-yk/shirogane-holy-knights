package com.shirogane.holy.knights.application.usecase

import com.shirogane.holy.knights.application.dto.*
import com.shirogane.holy.knights.application.port.`in`.NewsUseCasePort
import com.shirogane.holy.knights.domain.model.NewsId
import com.shirogane.holy.knights.domain.repository.NewsRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class NewsUseCaseImpl(
    private val newsRepository: NewsRepository
) : NewsUseCasePort {

    private val logger = LoggerFactory.getLogger(NewsUseCaseImpl::class.java)

    override suspend fun getNewsList(params: NewsListParamsDto): NewsSearchResultDto {
        logger.info("ニュース一覧取得ユースケース実行: $params")
        
        try {
            val newsList = newsRepository.findAll(params)
            val totalCount = newsRepository.countAll(params)
            
            val newsItems = newsList.map { NewsDto.fromDomain(it) }
            val hasMore = (params.page * params.pageSize) < totalCount
            
            return NewsSearchResultDto(
                items = newsItems,
                totalCount = totalCount,
                page = params.page,
                pageSize = params.pageSize,
                hasMore = hasMore
            )
        } catch (e: Exception) {
            logger.error("ニュース一覧取得エラー", e)
            return NewsSearchResultDto(
                items = emptyList(),
                totalCount = 0,
                page = params.page,
                pageSize = params.pageSize,
                hasMore = false
            )
        }
    }

    override suspend fun searchNews(params: NewsSearchParamsDto): NewsSearchResultDto {
        logger.info("ニュース検索ユースケース実行: $params")
        
        try {
            val newsList = newsRepository.searchNews(params)
            val totalCount = newsRepository.countSearchResults(params)
            
            val newsItems = newsList.map { NewsDto.fromDomain(it) }
            val hasMore = (params.page * params.pageSize) < totalCount
            
            return NewsSearchResultDto(
                items = newsItems,
                totalCount = totalCount,
                page = params.page,
                pageSize = params.pageSize,
                hasMore = hasMore
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