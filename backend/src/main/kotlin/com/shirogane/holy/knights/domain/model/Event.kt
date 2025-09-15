package com.shirogane.holy.knights.domain.model

import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime

/**
 * イベントドメインモデル
 * カレンダーイベントの情報を表現
 */
data class Event(
    val id: EventId,
    val title: String,
    val description: String?,
    val eventDate: LocalDate, // JST基準のYYYY-MM-DD
    val eventTime: LocalTime?,
    val endDate: LocalDate?,
    val endTime: LocalTime?,
    val url: String?,
    val imageUrl: String?,
    val eventTypes: List<EventType>,
    val createdAt: Instant
)

/**
 * イベントコレクション
 */
class Events(events: List<Event>): FCC<Event>(
    events.sortedWith(compareBy { it.eventDate })
)

/**
 * イベントID値オブジェクト
 */
@JvmInline
value class EventId(val value: Long) {
    override fun toString(): String = value.toString()
}

/**
 * イベントタイプ値オブジェクト
 */
data class EventType(
    val id: Int,
    val type: String
)