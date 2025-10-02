package com.shirogane.holy.knights.adapter.controller.port

import arrow.core.Either
import com.shirogane.holy.knights.adapter.controller.dto.SpecialEventDto
import com.shirogane.holy.knights.adapter.controller.dto.SpecialEventSearchResultDto
import com.shirogane.holy.knights.application.usecase.UseCaseError

/**
 * スペシャルイベントユースケースポート
 * Controller層からUseCase層への依存を表現するインターフェース
 */
interface SpecialsUseCasePort {
    /**
     * スペシャルイベント一覧取得
     */
    suspend fun getSpecialEvents(): Either<UseCaseError, SpecialEventSearchResultDto>

    /**
     * スペシャルイベント詳細取得
     */
    suspend fun getSpecialEventDetails(eventId: String): Either<UseCaseError, SpecialEventDto>
}