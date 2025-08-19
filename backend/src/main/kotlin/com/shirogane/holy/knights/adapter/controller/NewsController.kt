package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.NewsCategoryDto
import com.shirogane.holy.knights.application.dto.NewsSearchParamsDto
import com.shirogane.holy.knights.application.dto.NewsSearchResultDto
import com.shirogane.holy.knights.application.port.`in`.NewsUseCasePort
import org.springframework.stereotype.Component

@Component
class NewsController(
    private val newsUseCase: NewsUseCasePort
) {
    suspend fun searchNews(params: NewsSearchParamsDto): NewsSearchResultDto {
        val result = newsUseCase.searchNews(params)
        return result
    }
    
    suspend fun getNewsCategories(): List<NewsCategoryDto> {
        val categories = newsUseCase.getNewsCategories()
        return categories
    }
}
