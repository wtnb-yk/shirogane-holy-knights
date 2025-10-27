package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class MessageQueryBuilder {

    fun buildGetBySpecialEventIdQuery(specialEventId: String): QuerySpec {
        val sql = """
            SELECT
                id, special_event_id, name, message, created_at
            FROM messages
            WHERE special_event_id = :specialEventId
            ORDER BY created_at DESC
        """.trimIndent()

        return QuerySpec(sql, mapOf("specialEventId" to UUID.fromString(specialEventId)))
    }
}
