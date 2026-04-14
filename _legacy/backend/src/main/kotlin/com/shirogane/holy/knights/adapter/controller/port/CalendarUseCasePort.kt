package com.shirogane.holy.knights.adapter.controller.port

import arrow.core.Either
import com.shirogane.holy.knights.adapter.controller.dto.EventSearchParamsDto
import com.shirogane.holy.knights.adapter.controller.dto.EventSearchResultDto
import com.shirogane.holy.knights.adapter.controller.dto.EventTypeDto
import com.shirogane.holy.knights.application.usecase.UseCaseError

/**
 * カレンダーユースケースポート
 * Controller層からUseCase層への依存を表現するインターフェース
 */
interface CalendarUseCasePort {
    /**
     * イベント検索
     */
    suspend fun searchEvents(params: EventSearchParamsDto): Either<UseCaseError, EventSearchResultDto>

    /**
     * 全イベントタイプを取得
     */
    suspend fun getEventTypes(): List<EventTypeDto>
}