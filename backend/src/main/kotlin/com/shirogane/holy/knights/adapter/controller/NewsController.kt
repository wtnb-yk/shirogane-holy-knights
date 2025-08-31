package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.dto.NewsSearchParamsDto
import com.shirogane.holy.knights.application.port.`in`.NewsUseCasePort
import org.springframework.stereotype.Component

@Component
class NewsController(
    private val newsUseCase: NewsUseCasePort
): Controller {
    suspend fun searchNews(params: NewsSearchParamsDto) =
        newsUseCase.searchNews(params)
            .fold(
                { it.toResponse() },
                { it }
            )
    
    suspend fun getNewsCategories() = 
        newsUseCase.getNewsCategories()
}
