package com.shirogane.holy.knights.adapter.controller.dto

import com.shirogane.holy.knights.domain.model.Message
import kotlinx.serialization.Serializable

/**
 * メッセージDTO（データ転送オブジェクト）
 * HTTP APIレスポンスで使用するシリアライズ可能なデータ構造
 */
@Serializable
data class MessageDto(
    val id: String,
    val name: String,
    val message: String,
    val createdAt: String
) {
    companion object {
        /**
         * ドメインモデルからDTOへの変換
         */
        fun fromDomain(message: Message): MessageDto {
            return MessageDto(
                id = message.id.value,
                name = message.name,
                message = message.message,
                createdAt = message.createdAt.toString()
            )
        }
    }
}
