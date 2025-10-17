package com.shirogane.holy.knights.adapter.gateway.entity

import com.shirogane.holy.knights.domain.model.SpecialEvent
import com.shirogane.holy.knights.domain.model.SpecialEventId
import com.shirogane.holy.knights.domain.model.SpecialEventStatus
import java.time.Instant
import java.time.LocalDate

/**
 * スペシャルイベントエンティティ
 * データベースのspecial_eventsテーブルとのマッピング用
 */
@org.springframework.data.relational.core.mapping.Table("special_events")
data class SpecialEventEntity(
    @org.springframework.data.annotation.Id
    val id: String,
    val title: String,
    val description: String?,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val createdAt: Instant
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): SpecialEvent {
        val now = LocalDate.now()
        
        val status = when {
            now < startDate -> SpecialEventStatus.UPCOMING
            now > endDate -> SpecialEventStatus.ENDED
            else -> SpecialEventStatus.ACTIVE
        }

        return SpecialEvent(
            id = SpecialEventId(id),
            title = title,
            description = description ?: "",
            startDate = startDate,
            endDate = endDate,
            status = status
        )
    }
}