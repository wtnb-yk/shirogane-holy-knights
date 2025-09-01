package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.application.dto.NewsSearchParamsDto
import com.shirogane.holy.knights.application.port.`in`.NewsUseCasePort
import org.springframework.stereotype.Component

@Component
class NewsController(
    private val newsUseCase: NewsUseCasePort,
    override val objectMapper: ObjectMapper
): Controller {
    suspend fun searchNews(requestBody: String?) =
        newsUseCase.searchNews(parseRequestBody(requestBody, NewsSearchParamsDto::class.java) ?: NewsSearchParamsDto())
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
    
    suspend fun getNewsCategories() = 
        ApiResponse(200, newsUseCase.getNewsCategories())
}
