package com.shirogane.holy.knights.adapter.gateway.mapper

import com.shirogane.holy.knights.domain.model.SpecialEvent
import com.shirogane.holy.knights.domain.model.SpecialEventId
import com.shirogane.holy.knights.domain.model.SpecialEventStatus
import com.shirogane.holy.knights.domain.model.SpecialEventType
import io.r2dbc.spi.Row
import org.springframework.stereotype.Component
import java.time.LocalDate

/**
 * スペシャルイベント関連のRowMapper
 */
@Component
class SpecialEventRowMapper : RowMapper<SpecialEvent> {

    override fun map(row: Row): SpecialEvent {
        val startDate = row.get("start_date", LocalDate::class.java)!!
        val endDate = row.get("end_date", LocalDate::class.java)!!

        val now = LocalDate.now()

        val status = when {
            now < startDate -> SpecialEventStatus.UPCOMING
            now > endDate -> SpecialEventStatus.ENDED
            else -> SpecialEventStatus.ACTIVE
        }

        val eventTypes = parseEventTypes(
            eventTypeIdsStr = row.get("event_type_ids", String::class.java) ?: "",
            eventTypesStr = row.get("event_types", String::class.java) ?: ""
        )

        return SpecialEvent(
            id = SpecialEventId(row.get("id", String::class.java)!!),
            title = row.get("title", String::class.java)!!,
            description = row.get("description", String::class.java) ?: "",
            startDate = startDate,
            endDate = endDate,
            status = status,
            eventTypes = eventTypes
        )
    }

    private fun parseEventTypes(
        eventTypeIdsStr: String,
        eventTypesStr: String
    ): List<SpecialEventType> {
        if (eventTypeIdsStr.isEmpty()) return emptyList()

        val ids = eventTypeIdsStr.split(",").map { it.trim() }
        val types = eventTypesStr.split(",").map { it.trim() }

        return if (ids.size == types.size) {
            ids.zip(types) { id, type ->
                SpecialEventType(
                    id = id.toInt(),
                    type = type
                )
            }
        } else {
            emptyList()
        }
    }
}