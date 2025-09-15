package com.shirogane.holy.knights.adapter.gateway.entity

import com.shirogane.holy.knights.domain.model.Event
import com.shirogane.holy.knights.domain.model.EventId
import com.shirogane.holy.knights.domain.model.EventType
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime

/**
 * イベントエンティティ
 * データベースのeventsテーブルとのマッピング用
 */
data class EventEntity(
    val id: Long,
    val title: String,
    val description: String?,
    val eventDate: LocalDate,
    val eventTime: LocalTime?,
    val endDate: LocalDate?,
    val endTime: LocalTime?,
    val url: String?,
    val imageUrl: String?,
    val createdAt: Instant,
    val eventTypes: List<EventTypeEntity> = emptyList()
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): Event {
        return Event(
            id = EventId(id),
            title = title,
            description = description,
            eventDate = eventDate,
            eventTime = eventTime,
            endDate = endDate,
            endTime = endTime,
            url = url,
            imageUrl = imageUrl,
            eventTypes = eventTypes.map { it.toDomain() },
            createdAt = createdAt
        )
    }
}

/**
 * イベントタイプエンティティ
 * データベースのevent_typesテーブルとのマッピング用
 */
@org.springframework.data.relational.core.mapping.Table("event_types")
data class EventTypeEntity(
    @org.springframework.data.annotation.Id
    val id: Int,
    val type: String
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): EventType {
        return EventType(
            id = id,
            type = type
        )
    }
}