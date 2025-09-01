package com.shirogane.holy.knights.application.usecase

import arrow.core.Either
import arrow.core.raise.either
import com.shirogane.holy.knights.application.dto.*
import com.shirogane.holy.knights.application.port.`in`.NewsUseCasePort
import com.shirogane.holy.knights.domain.repository.NewsRepository
import org.springframework.stereotype.Service

@Service
class NewsUseCaseImpl(
    private val newsRepository: NewsRepository
) : NewsUseCasePort {

    override suspend fun searchNews(params: NewsSearchParamsDto): Either<UseCaseError, NewsSearchResultDto> =
        either {
            val pageRequest = params.toPageRequest()
            val startDate = params.startDate
            val endDate = params.endDate
            
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
            NewsSearchResultDto.of(newsDto, totalCount, pageRequest)
        }


    override suspend fun getNewsCategories(): List<NewsCategoryDto> {
        val categories = newsRepository.findAllCategories()
        return categories.map { NewsCategoryDto.fromDomain(it) }
    }
}
