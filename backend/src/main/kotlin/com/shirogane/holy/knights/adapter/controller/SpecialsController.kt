package com.shirogane.holy.knights.adapter.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.port.SpecialsUseCasePort
import org.springframework.stereotype.Component

@Component
class SpecialsController(
    private val specialsUseCase: SpecialsUseCasePort,
    override val objectMapper: ObjectMapper
) : Controller {

    /**
     * スペシャルイベント一覧を取得
     */
    suspend fun getSpecialEvents() =
        specialsUseCase.getSpecialEvents()
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )

    /**
     * スペシャルイベント詳細を取得
     */
    suspend fun getSpecialEventDetails(eventId: String) =
        specialsUseCase.getSpecialEventDetails(eventId)
            .fold(
                { it.toResponse() },
                { ApiResponse(200, it) }
            )
}