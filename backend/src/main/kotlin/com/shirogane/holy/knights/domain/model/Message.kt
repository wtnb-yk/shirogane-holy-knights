package com.shirogane.holy.knights.domain.model

import java.time.Instant

/**
 * メッセージドメインモデル
 */
data class Message(
    val id: MessageId,
    val specialEventId: SpecialEventId,
    val name: String,
    val message: String,
    val createdAt: Instant
)

/**
 * メッセージコレクション
 */
class Messages(messages: List<Message>) : FCC<Message>(
    messages.sortedByDescending { it.createdAt }
)

/**
 * メッセージID値オブジェクト
 */
@JvmInline
value class MessageId(val value: String) {
    override fun toString(): String = value
}
