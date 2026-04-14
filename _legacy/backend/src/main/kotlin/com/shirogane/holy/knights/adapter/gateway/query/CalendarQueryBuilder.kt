package com.shirogane.holy.knights.adapter.gateway.query

import com.shirogane.holy.knights.adapter.gateway.QuerySpec
import com.shirogane.holy.knights.adapter.gateway.model.CalendarSearchCriteria
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class CalendarQueryBuilder : QueryBuilder<CalendarSearchCriteria> {

    override fun buildSearchQuery(criteria: CalendarSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.eventTypeIds,
            criteria.startDate,
            criteria.endDate
        )

        val whereClause = if (conditions.first.isNotEmpty()) {
            "WHERE " + conditions.first.joinToString(" AND ")
        } else ""

        val sql = """
            SELECT
                e.id, e.title, e.description, e.event_date, e.event_time,
                e.end_date, e.end_time, e.url, e.image_url, e.created_at,
                COALESCE(STRING_AGG(et.id::text, ',' ORDER BY et.id), '') as event_type_ids,
                COALESCE(STRING_AGG(et.type, ',' ORDER BY et.id), '') as event_types
            FROM events e
            LEFT JOIN event_event_types eet ON e.id = eet.event_id
            LEFT JOIN event_types et ON eet.event_type_id = et.id
            $whereClause
            GROUP BY e.id, e.title, e.description, e.event_date, e.event_time, e.end_date, e.end_time, e.url, e.image_url, e.created_at
            ORDER BY e.event_date ASC, e.event_time ASC
            LIMIT :limit OFFSET :offset
        """.trimIndent()

        val bindings = conditions.second + mapOf(
            "limit" to criteria.limit,
            "offset" to criteria.offset
        )

        return QuerySpec(sql, bindings)
    }

    override fun buildCountQuery(criteria: CalendarSearchCriteria): QuerySpec {
        val conditions = buildSearchConditions(
            criteria.eventTypeIds,
            criteria.startDate,
            criteria.endDate
        )

        val whereClause = if (conditions.first.isNotEmpty()) {
            "WHERE " + conditions.first.joinToString(" AND ")
        } else ""

        val sql = """
            SELECT COUNT(DISTINCT e.id)
            FROM events e
            LEFT JOIN event_event_types eet ON e.id = eet.event_id
            LEFT JOIN event_types et ON eet.event_type_id = et.id
            $whereClause
        """.trimIndent()

        return QuerySpec(sql, conditions.second)
    }

    private fun buildSearchConditions(
        eventTypeIds: List<Int>?,
        startDate: LocalDate?,
        endDate: LocalDate?
    ): Pair<List<String>, Map<String, Any>> {
        val conditions = mutableListOf<String>()
        val bindings = mutableMapOf<String, Any>()

        eventTypeIds?.takeIf { it.isNotEmpty() }?.let {
            conditions.add("eet.event_type_id = ANY(:eventTypeIds)")
            bindings["eventTypeIds"] = it.toTypedArray()
        }

        startDate?.let {
            conditions.add("(e.event_date >= :startDate OR (e.end_date IS NOT NULL AND e.end_date >= :startDate))")
            bindings["startDate"] = it
        }

        endDate?.let {
            conditions.add("e.event_date <= :endDate")
            bindings["endDate"] = it
        }

        return Pair(conditions, bindings)
    }
}