package com.shirogane.holy.knights.adapter.gateway.entity

import com.shirogane.holy.knights.domain.model.SpecialEventType

/**
 * スペシャルイベントタイプエンティティ
 * データベースのspecial_event_typesテーブルとのマッピング用
 */
@org.springframework.data.relational.core.mapping.Table("special_event_types")
data class SpecialEventTypeEntity(
    @org.springframework.data.annotation.Id
    val id: Int,
    val type: String
) {
    /**
     * エンティティからドメインモデルへの変換
     */
    fun toDomain(): SpecialEventType {
        return SpecialEventType(
            id = id,
            type = type
        )
    }
}
