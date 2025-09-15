package com.shirogane.holy.knights.adapter.gateway.mapper

import com.shirogane.holy.knights.domain.model.*
import io.r2dbc.spi.Row
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime

/**
 * カレンダー関連のRowMapper
 * NewsRowMapperと同じパターンで実装
 */
@Component
class CalendarRowMapper : RowMapper<Event> {

    override fun map(row: Row): Event {
        val eventTypes = parseEventTypes(
            eventTypeIdsStr = row.get("event_type_ids", String::class.java) ?: "",
            eventTypesStr = row.get("event_types", String::class.java) ?: ""
        )

        return Event(
            id = EventId(row.get("id", Long::class.java)!!),
            title = row.get("title", String::class.java)!!,
            description = row.get("description", String::class.java),
            eventDate = row.get("event_date", LocalDate::class.java)!!,
            eventTime = row.get("event_time", LocalTime::class.java),
            endDate = row.get("end_date", LocalDate::class.java),
            endTime = row.get("end_time", LocalTime::class.java),
            url = row.get("url", String::class.java),
            imageUrl = row.get("image_url", String::class.java),
            eventTypes = eventTypes,
            createdAt = row.get("created_at", Instant::class.java)!!
        )
    }

    private fun parseEventTypes(
        eventTypeIdsStr: String,
        eventTypesStr: String
    ): List<EventType> {
        if (eventTypeIdsStr.isEmpty()) return emptyList()

        val ids = eventTypeIdsStr.split(",").map { it.trim() }
        val types = eventTypesStr.split(",").map { it.trim() }

        return if (ids.size == types.size) {
            ids.zip(types) { id, type ->
                EventType(
                    id = id.toInt(),
                    type = type
                )
            }
        } else {
            emptyList()
        }
    }
}