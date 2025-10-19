package com.shirogane.holy.knights.adapter.gateway.mapper

import com.shirogane.holy.knights.domain.model.Message
import com.shirogane.holy.knights.domain.model.MessageId
import com.shirogane.holy.knights.domain.model.SpecialEventId
import io.r2dbc.spi.Row
import org.springframework.stereotype.Component
import java.time.Instant

/**
 * メッセージ関連のRowMapper
 */
@Component
class MessageRowMapper : RowMapper<Message> {

    override fun map(row: Row): Message {
        return Message(
            id = MessageId(row.get("id", String::class.java)!!),
            specialEventId = SpecialEventId(row.get("special_event_id", String::class.java)!!),
            name = row.get("name", String::class.java)!!,
            message = row.get("message", String::class.java)!!,
            createdAt = row.get("created_at", Instant::class.java)!!
        )
    }
}
