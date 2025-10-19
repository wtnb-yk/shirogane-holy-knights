package com.shirogane.holy.knights.adapter.gateway.entity

import com.shirogane.holy.knights.domain.model.Message
import com.shirogane.holy.knights.domain.model.MessageId
import com.shirogane.holy.knights.domain.model.SpecialEventId
import java.time.Instant

/**
 * メッセージエンティティ
 * データベースのmessagesテーブルとのマッピング用
 */
@org.springframework.data.relational.core.mapping.Table("messages")
data class MessageEntity(
    @org.springframework.data.annotation.Id
    val id: String,
    val specialEventId: String,
    val name: String,
    val message: String,
    val createdAt: Instant
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): Message {
        return Message(
            id = MessageId(id),
            specialEventId = SpecialEventId(specialEventId),
            name = name,
            message = message,
            createdAt = createdAt
        )
    }
}
