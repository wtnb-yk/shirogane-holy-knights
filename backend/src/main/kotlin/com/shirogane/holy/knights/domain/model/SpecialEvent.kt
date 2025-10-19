package com.shirogane.holy.knights.domain.model

import java.time.LocalDate

/**
 * スペシャルイベントドメインモデル
 * 特別なイベントやキャンペーンの情報を表現
 */
data class SpecialEvent(
    val id: SpecialEventId,
    val title: String,
    val description: String,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val status: SpecialEventStatus,
    val eventTypes: List<SpecialEventType> = emptyList()
)

/**
 * スペシャルイベントコレクション
 */
class SpecialEvents(events: List<SpecialEvent>) : FCC<SpecialEvent>(
    events.sortedWith(compareBy<SpecialEvent> { it.startDate }.thenBy { it.title })
)

/**
 * スペシャルイベントID値オブジェクト
 */
@JvmInline
value class SpecialEventId(val value: String) {
    override fun toString(): String = value
}

/**
 * スペシャルイベントステータス列挙型
 */
enum class SpecialEventStatus {
    UPCOMING,
    ACTIVE,
    ENDED
}