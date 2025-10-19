package com.shirogane.holy.knights.adapter.controller.dto

import com.shirogane.holy.knights.domain.model.Messages
import com.shirogane.holy.knights.domain.model.SpecialEvent
import kotlinx.serialization.Serializable

/**
 * スペシャルイベント詳細DTO（データ転送オブジェクト）
 * イベント情報とメッセージリストを含む
 */
@Serializable
data class SpecialEventDetailDto(
    val event: SpecialEventDto,
    val messages: List<MessageDto>
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(specialEvent: SpecialEvent, messages: Messages): SpecialEventDetailDto {
            return SpecialEventDetailDto(
                event = SpecialEventDto.fromDomain(specialEvent),
                messages = messages.map { MessageDto.fromDomain(it) }
            )
        }
    }
}
