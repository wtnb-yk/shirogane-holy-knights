package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.dto.EventSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.port.CalendarUseCasePort
import org.springframework.stereotype.Component

@Component
class CalendarController(
    private val calendarUseCase: CalendarUseCasePort,
    override val objectMapper: ObjectMapper
): Controller {

    suspend fun searchEvents(requestBody: String?) =
        calendarUseCase.searchEvents(parseRequestBody(requestBody, EventSearchParamsDto::class.java) ?: EventSearchParamsDto())
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )

    suspend fun getEventTypes() =
        ApiResponse(200, calendarUseCase.getEventTypes())
}